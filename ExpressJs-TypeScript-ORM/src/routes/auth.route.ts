import express from 'express'
import { loginUser } from '../controllers/user.controller';

const router = express.Router()

/**
 * @swagger
 * /api/auth:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user by using email and password
 *     description: Use email and password login, after login successfully will automatically generator JWT token
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
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: true
 *               message: "Login user successfully"
 *               token: YOUR_JWT_TOKEN
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "User not found"
 *               error: ""
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Internal Server Error"
 *               error: "Database connection failed"
 */
router.post("/", loginUser);

export default router;