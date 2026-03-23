import { db } from '../firebase/firebaseAdmin.js';

const createError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

const validateScore = (score) => {
    const num = Number(score);
    if (isNaN(num) || num < 1 || num > 10) {
        throw createError(400, 'Score must be a number between 1 and 10.');
    }
    return num;
};

export const submitRating = async ({ userId, footballerId, score, review }) => {
    const validScore = validateScore(score);

    const footballerDoc = await db.collection('footballers').doc(footballerId).get();
    if (!footballerDoc.exists) {
        throw createError(404, 'Footballer not found.');
    }

    const existing = await db.collection('ratings')
        .where('userId', '==', userId)
        .where('footballerId', '==', footballerId)
        .limit(1)
        .get();

    const now = new Date().toISOString();

    if (!existing.empty) {
        const existingDoc = existing.docs[0];
        await existingDoc.ref.update({
            score: validScore,
            review: review || '',
            updatedAt: now,
        });

        return {
            message: 'Your rating has been updated.',
            ratingId: existingDoc.id,
            wasUpdated: true,
        };
    }

    const newRatingRef = db.collection('ratings').doc();
    const ratingData = {
        id: newRatingRef.id,
        footballerId,
        userId,
        score: validScore,
        review: review || '',
        createdAt: now,
        updatedAt: now,
    };

    await newRatingRef.set(ratingData);

    return {
        message: 'Rating submitted successfully.',
        ratingId: newRatingRef.id,
        wasUpdated: false,
    };
};


export const updateRating = async ({ ratingId, userId, score, review }) => {
    if (score === undefined && review === undefined) {
        throw createError(400, 'Provide at least one field to update: score or review.');
    }

    const ratingRef = db.collection('ratings').doc(ratingId);
    const ratingDoc = await ratingRef.get();

    if (!ratingDoc.exists) {
        throw createError(404, 'Rating not found.');
    }

    const rating = ratingDoc.data();

    if (rating.userId !== userId) {
        throw createError(403, 'You are not allowed to edit this rating.');
    }

    const updates = { updatedAt: new Date().toISOString() };

    if (score !== undefined) {
        updates.score = validateScore(score);
    }
    if (review !== undefined) {
        updates.review = review;
    }

    await ratingRef.update(updates);

    return { message: 'Rating updated successfully.', ratingId };
};

export const deleteRating = async ({ ratingId, userId }) => {
    const ratingRef = db.collection('ratings').doc(ratingId);
    const ratingDoc = await ratingRef.get();

    if (!ratingDoc.exists) {
        throw createError(404, 'Rating not found.');
    }

    const rating = ratingDoc.data();

    if (rating.userId !== userId) {
        throw createError(403, 'You are not allowed to delete this rating.');
    }

    await ratingRef.delete();

    return { message: 'Rating deleted successfully.' };
};