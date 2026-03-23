import * as userService from '../services/userService.js';

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

export const getUserProfile = handle(async (req) => {
    const { id } = req.params;
    return userService.getUserProfile({ userId: id });
});