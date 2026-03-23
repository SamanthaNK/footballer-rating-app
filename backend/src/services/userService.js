import { db } from '../firebase/firebaseAdmin.js';

const createError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const getUserProfile = async ({ userId }) => {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
        throw createError(404, 'User not found.');
    }

    const user = userDoc.data();

    const ratingsSnap = await db.collection('ratings')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    const ratings = ratingsSnap.docs.map((doc) => doc.data());

    return {
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
        },
        totalRatings: ratings.length,
        ratings,
    };
};