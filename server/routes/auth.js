/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and management
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidationRules, loginValidationRules, validate } = require('../middleware/validator');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [citizen, investigator] }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', registerValidationRules(), validate, authController.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', loginValidationRules(), validate, authController.login);
router.get('/verify', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/refresh', authController.refresh);

// Password Reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-otp', authController.verifyResetOtp);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
