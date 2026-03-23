import * as ratingService from '../services/ratingService.js';

const handle = (fn) => async (req, res) => {
    try {
        const result = await fn(req, res);
        const { _status, ...data } = result;
        return res.status(_status || 200).json(data);
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'An unexpected error occurred.',
        });
    }
};

export const submitRating = handle(async (req) => {
    const { footballerId, score, review } = req.body;
    const userId = req.user.userId;

    if (!footballerId || score === undefined) {
        const err = new Error('footballerId and score are required.');
        err.status = 400;
        throw err;
    }

    return {
        ...(await ratingService.submitRating({ userId, footballerId, score, review })),
        _status: 201,
    };
});

export const updateRating = handle(async (req) => {
    const { id } = req.params;
    const { score, review } = req.body;
    const userId = req.user.userId;

    return ratingService.updateRating({ ratingId: id, userId, score, review });
});

export const deleteRating = handle(async (req) => {
    const { id } = req.params;
    const userId = req.user.userId;

    return ratingService.deleteRating({ ratingId: id, userId });
});