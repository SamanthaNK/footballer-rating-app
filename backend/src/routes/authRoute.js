import {Router} from 'express';
import {
    registerUser,
    verifyEmailCode,
    resendVerification,
    loginUser,
    forgotPassword,
    verifyResetCode,
    resetPassword,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyEmailCode);
router.post('/resend-verification', resendVerification);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

export default router;