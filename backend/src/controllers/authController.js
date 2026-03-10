import * as authService from '../services/authService.js';

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

export const registerUser = handle(async (req) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        const err = new Error('Full name, email, and password are required.');
        err.status = 400;
        throw err;
    }
    return { ...(await authService.register({ fullName, email, password })), _status: 201 };
});

export const verifyEmailCode = handle(async (req) => {
    const { userId, code } = req.body;
    return authService.verifyEmail({ userId, code });
});

export const resendVerification = handle(async (req) => {
    const { userId } = req.body;
    if (!userId) {
        const err = new Error('userId is required.');
        err.status = 400;
        throw err;
    }
    return authService.resendVerificationCode({ userId });
});

export const loginUser = handle(async (req) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const err = new Error('Email and password are required.');
        err.status = 400;
        throw err;
    }
    return authService.login({ email, password });
});

export const forgotPassword = handle(async (req) => {
    const { email } = req.body;
    if (!email) {
        const err = new Error('Email is required.');
        err.status = 400;
        throw err;
    }
    return authService.forgotPassword({ email });
});

export const verifyResetCode = handle(async (req) => {
    const { email, code } = req.body;
    return authService.verifyResetCode({ email, code });
});

export const resetPassword = handle(async (req) => {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
        const err = new Error('resetToken and newPassword are required.');
        err.status = 400;
        throw err;
    }
    return authService.resetPassword({ resetToken, newPassword });
});