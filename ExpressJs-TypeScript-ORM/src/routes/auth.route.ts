import express from "express";
import { getProfile, loginUser } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

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

/**
 * @swagger
 * /api/auth:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get the authenticated user's profile
 *     description: Retrieves the profile of the authenticated user based on the provided JWT token. Requires authentication via Bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: true
 *               message: "Profile fetched successfully"
 *               data:
 *                 id: "12345"
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 createdAt: "2023-10-01T00:00:00.000Z"
 *                 updatedAt: "2023-10-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Unauthorized: No token provided"
 *       404:
 *         description: Not Found - User associated with the token does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "User not found"
 *               error: "User with email john.doe@example.com does not exist"
 *       500:
 *         description: Internal Server Error - Failed to fetch user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Failed to fetch profile"
 *               error: "Internal server error"
 */
router.get("/", authenticateToken, getProfile);

export default router;
