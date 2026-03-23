import { db } from '../firebase/firebaseAdmin.js';

const createError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

const calcAverage = (ratingDocs) => {
    if (!ratingDocs.length) return null;
    const total = ratingDocs.reduce((sum, r) => sum + r.score, 0);
    return parseFloat((total / ratingDocs.length).toFixed(1));
};

const buildPrefixRange = (term) => {
    const start = term.trim().toLowerCase();
    if (!start) return null;

    const lastChar = start[start.length - 1];
    const nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
    const end = start.slice(0, -1) + nextChar;

    return { start, end };
};

const prefixQuery = (field, range) => {
    if (!range) return null;
    return db.collection('footballers')
        .where(field, '>=', range.start)
        .where(field, '<', range.end)
        .limit(50)
        .get();
};

export const getFootballers = async ({ limit, cursor }) => {
    let query = db.collection('footballers').orderBy('name').limit(limit);

    if (cursor) {
        const cursorDoc = await db.collection('footballers').doc(cursor).get();
        if (cursorDoc.exists) {
            query = query.startAfter(cursorDoc);
        }
    }

    const snap = await query.get();
    const footballers = snap.docs.map((doc) => doc.data());
    const nextCursor = snap.docs.length === limit
        ? snap.docs[snap.docs.length - 1].id
        : null;

    return { footballers, nextCursor, count: footballers.length };
};

export const searchFootballers = async ({ q, position, club, nationality }) => {
    const queryPromises = [];

    if (q) {
        const range = buildPrefixRange(q);
        if (range) {
            const fullNameQ = prefixQuery('nameLower', range);
            if (fullNameQ) queryPromises.push(fullNameQ);

            const lastNameQ = prefixQuery('lastNameLower', range);
            if (lastNameQ) queryPromises.push(lastNameQ);
        }
    }

    if (position) {
        queryPromises.push(
            db.collection('footballers')
                .where('position', '==', position)
                .limit(50)
                .get()
        );
    }

    if (club) {
        queryPromises.push(
            db.collection('footballers')
                .where('clubLower', '==', club.trim().toLowerCase())
                .limit(50)
                .get()
        );
    }

    if (nationality) {
        queryPromises.push(
            db.collection('footballers')
                .where('nationalityLower', '==', nationality.trim().toLowerCase())
                .limit(50)
                .get()
        );
    }

    const snaps = await Promise.all(queryPromises);

    const seen = new Map();
    for (const snap of snaps) {
        for (const doc of snap.docs) {
            if (!seen.has(doc.id)) {
                seen.set(doc.id, doc.data());
            }
        }
    }

    const footballers = Array.from(seen.values());
    return { footballers, count: footballers.length };
};

export const getFootballerById = async ({ id }) => {
    const footballerDoc = await db.collection('footballers').doc(id).get();

    if (!footballerDoc.exists) {
        throw createError(404, 'Footballer not found.');
    }

    const footballer = footballerDoc.data();

    const ratingsSnap = await db.collection('ratings')
        .where('footballerId', '==', id)
        .orderBy('createdAt', 'desc')
        .get();

    const ratings = ratingsSnap.docs.map((doc) => doc.data());
    const averageRating = calcAverage(ratings);

    return { footballer, averageRating, totalRatings: ratings.length, ratings };
};

export const getLeaderboard = async () => {
    const [footballersSnap, ratingsSnap] = await Promise.all([
        db.collection('footballers').get(),
        db.collection('ratings').get(),
    ]);

    const scoreMap = {};
    for (const doc of ratingsSnap.docs) {
        const { footballerId, score } = doc.data();
        if (!scoreMap[footballerId]) scoreMap[footballerId] = [];
        scoreMap[footballerId].push(score);
    }

    const results = footballersSnap.docs
        .map((doc) => {
            const footballer = doc.data();
            const scores = scoreMap[footballer.id] || [];
            if (!scores.length) return null;

            const avg = parseFloat(
                (scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(1)
            );
            return { ...footballer, averageRating: avg, totalRatings: scores.length };
        })
        .filter(Boolean)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 20);

    return { leaderboard: results, count: results.length };
};