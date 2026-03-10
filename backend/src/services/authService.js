import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../firebase/firebaseAdmin.js';
import {
    generateSixDigitCode,
    sendVerificationEmail,
    sendPasswordResetEmail,
} from './emailService.js';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const VERIFY_CODE_TTL_MS = 15 * 60 * 1000;
const RESET_CODE_TTL_MS = 10 * 60 * 1000;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables.');
}

const createError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (pw) => pw.length >= 8 && /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw);

export const register = async ({ fullName, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName || cleanName.length < 2) {
        throw createError(400, 'Full name must be at least 2 characters.');
    }
    if (!isValidEmail(cleanEmail)) {
        throw createError(400, 'Please provide a valid email address.');
    }
    if (!isValidPassword(password)) {
        throw createError(400, 'Password must be at least 8 characters and include a letter and a number.');
    }

    const emailSnap = await db.collection('users').where('email', '==', cleanEmail).limit(1).get();
    if (!emailSnap.empty) {
        throw createError(409, 'An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const rawCode = generateSixDigitCode();
    const codeHash = await bcrypt.hash(rawCode, 8);

    const now = Date.now();
    const newUserRef = db.collection('users').doc();

    const userData = {
        id: newUserRef.id,
        fullName: cleanName,
        email: cleanEmail,
        passwordHash,
        isVerified: false,
        verificationCodeHash: codeHash,
        verificationCodeExpiresAt: now + VERIFY_CODE_TTL_MS,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await newUserRef.set(userData);

    try {
        await sendVerificationEmail(cleanEmail, cleanName.split(' ')[0], rawCode);
    } catch (emailErr) {
        console.error('Verification email failed:', emailErr.message);
    }

    return {
        message: 'Account created. Check your email for your 6-digit verification code.',
        userId: newUserRef.id,
    };
};

export const verifyEmail = async ({ userId, code }) => {
    if (!userId || !code || code.length !== 6) {
        throw createError(400, 'A valid 6-digit code is required.');
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        throw createError(404, 'Account not found.');
    }

    const user = userDoc.data();

    if (user.isVerified) {
        throw createError(400, 'This account is already verified.');
    }

    if (Date.now() > user.verificationCodeExpiresAt) {
        throw createError(400, 'Verification code has expired. Please request a new one.');
    }

    const isMatch = await bcrypt.compare(code, user.verificationCodeHash);
    if (!isMatch) {
        throw createError(400, 'Incorrect verification code. Please check and try again.');
    }

    await userRef.update({
        isVerified: true,
        verificationCodeHash: null,
        verificationCodeExpiresAt: null,
        updatedAt: new Date().toISOString(),
    });

    const token = jwt.sign(
        { userId: user.id, fullName: user.fullName },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return {
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email },
    };
};

export const resendVerificationCode = async ({ userId }) => {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) throw createError(404, 'Account not found.');

    const user = userDoc.data();

    if (user.isVerified) {
        throw createError(400, 'This account is already verified.');
    }

    const timeRemaining = user.verificationCodeExpiresAt - Date.now();
    if (timeRemaining > VERIFY_CODE_TTL_MS - 60000) {
        throw createError(429, 'Please wait a moment before requesting another code.');
    }

    const rawCode = generateSixDigitCode();
    const codeHash = await bcrypt.hash(rawCode, 8);
    const now = Date.now();

    await userRef.update({
        verificationCodeHash: codeHash,
        verificationCodeExpiresAt: now + VERIFY_CODE_TTL_MS,
        updatedAt: new Date().toISOString(),
    });

    await sendVerificationEmail(user.email, user.fullName.split(' ')[0], rawCode);

    return { message: 'A new verification code has been sent to your email.' };
};

export const login = async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    const snap = await db.collection('users').where('email', '==', cleanEmail).limit(1).get();

    if (snap.empty) {
        throw createError(401, 'Invalid email or password.');
    }

    const user = snap.docs[0].data();

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw createError(401, 'Invalid email or password.');
    }

    if (!user.isVerified) {
        throw createError(403, 'Please verify your email address before logging in.');
    }

    const token = jwt.sign(
        { userId: user.id, fullName: user.fullName },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return {
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email },
    };
};

export const forgotPassword = async ({ email }) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
        throw createError(400, 'Please provide a valid email address.');
    }

    const snap = await db.collection('users').where('email', '==', cleanEmail).limit(1).get();

    if (snap.empty) {
        return { message: 'If that email is registered, a reset code has been sent.' };
    }

    const user = snap.docs[0].data();
    const rawCode = generateSixDigitCode();
    const codeHash = await bcrypt.hash(rawCode, 8);
    const now = Date.now();

    await db.collection('users').doc(user.id).update({
        resetCodeHash: codeHash,
        resetCodeExpiresAt: now + RESET_CODE_TTL_MS,
        updatedAt: new Date().toISOString(),
    });

    try {
        await sendPasswordResetEmail(cleanEmail, user.fullName.split(' ')[0], rawCode);
    } catch (emailErr) {
        console.error('Reset email failed:', emailErr.message);
    }

    return { message: 'If that email is registered, a reset code has been sent.' };
};

export const verifyResetCode = async ({ email, code }) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!code || code.length !== 6) {
        throw createError(400, 'A valid 6-digit code is required.');
    }

    const snap = await db.collection('users').where('email', '==', cleanEmail).limit(1).get();
    if (snap.empty) throw createError(400, 'Invalid code or email.');

    const user = snap.docs[0].data();

    if (!user.resetCodeHash || !user.resetCodeExpiresAt) {
        throw createError(400, 'No reset code found. Please request a new one.');
    }

    if (Date.now() > user.resetCodeExpiresAt) {
        throw createError(400, 'Reset code has expired. Please request a new one.');
    }

    const isMatch = await bcrypt.compare(code, user.resetCodeHash);
    if (!isMatch) {
        throw createError(400, 'Incorrect reset code. Please check and try again.');
    }

    const resetToken = jwt.sign(
        { userId: user.id, purpose: 'password_reset' },
        JWT_SECRET,
        { expiresIn: '5m' }
    );

    return { resetToken, message: 'Code verified. You may now set a new password.' };
};

export const resetPassword = async ({ resetToken, newPassword }) => {
    if (!isValidPassword(newPassword)) {
        throw createError(400, 'Password must be at least 8 characters and include a letter and a number.');
    }

    let decoded;
    try {
        decoded = jwt.verify(resetToken, JWT_SECRET);
    } catch {
        throw createError(401, 'Reset session has expired. Please start over.');
    }

    if (decoded.purpose !== 'password_reset') {
        throw createError(401, 'Invalid reset token.');
    }

    const userRef = db.collection('users').doc(decoded.userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) throw createError(404, 'Account not found.');

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await userRef.update({
        passwordHash,
        resetCodeHash: null,
        resetCodeExpiresAt: null,
        updatedAt: new Date().toISOString(),
    });

    return { message: 'Password updated successfully. You can now log in.' };
};