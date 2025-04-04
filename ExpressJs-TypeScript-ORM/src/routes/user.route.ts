import express from "express";
import {
  createUser,
  getUserById,
  getUsers,
  updateStatusUser,
  updateUserById,
  updateUserOneField,
} from "../controllers/user.controller";

const router = express.Router();
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *           example: "12345"
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: The email address of the user
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The hashed password of the user (not returned in responses)
 *           example: "hashedpassword123"
 *         status:
 *           type: string
 *           description: The status of the user (active/inactive)
 *           example: "active"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *           example: "2023-10-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *           example: "2023-10-01T00:00:00.000Z"
 *     ResponseType:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: Indicates if the request was successful
 *           example: true
 *         message:
 *           type: string
 *           description: A message describing the result of the request
 *           example: "User fetched successfully"
 *         data:
 *           oneOf:
 *             - type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             - $ref: '#/components/schemas/User'
 *           description: The data returned by the request (can be a single user or an array of users)
 *         error:
 *           type: string
 *           description: An error message if the request failed
 *           example: "User not found"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieves a list of all users from the database. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: true
 *               message: "Users fetched successfully"
 *               data:
 *                 - id: "12345"
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   status: "active"
 *                   createdAt: "2023-10-01T00:00:00.000Z"
 *                   updatedAt: "2023-10-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Unauthorized: Invalid token"
 *       500:
 *         description: Internal Server Error - Failed to fetch users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Failed to fetch users"
 *               error: "Database connection failed"
 */
router.get("/", getUsers);
/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Creates a new user in the database. Requires authentication.
 *     security:
 *       - bearerAuth: []
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
 *               name:
 *                 type: string
 *                 description: The name of the user
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Successfully created a new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: true
 *               message: "User created successfully"
 *               data:
 *                 id: "12345"
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 status: "active"
 *                 createdAt: "2023-10-01T00:00:00.000Z"
 *                 updatedAt: "2023-10-01T00:00:00.000Z"
 *       400:
 *         description: Bad Request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Invalid input data"
 *               error: "Email is required"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Unauthorized: Invalid token"
 *       500:
 *         description: Internal Server Error - Failed to create user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Failed to create user"
 *               error: "Database connection failed"
 */
router.post("/", createUser);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     description: Retrieves a user by their ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *         example: "12345"
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: true
 *               message: "User fetched successfully"
 *               data:
 *                 id: "12345"
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 status: "active"
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
 *               message: "Unauthorized: Invalid token"
 *       404:
 *         description: Not Found - User with the specified ID does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "User not found"
 *               error: "User with ID 12345 does not exist"
 *       500:
 *         description: Internal Server Error - Failed to fetch user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Failed to fetch user"
 *               error: "Database connection failed"
 */
router.get("/:id", getUserById);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user by ID
 *     description: Updates a user by their ID with the provided data. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *         example: "12345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the user
 *                 example: "John Smith"
 *               email:
 *                 type: string
 *                 description: The updated email address of the user
 *                 example: "john.smith@example.com"
 *               password:
 *                 type: string
 *                 description: The updated password of the user (optional)
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Successfully updated the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: true
 *               message: "User updated successfully"
 *               data:
 *                 id: "12345"
 *                 name: "John Smith"
 *                 email: "john.smith@example.com"
 *                 status: "active"
 *                 createdAt: "2023-10-01T00:00:00.000Z"
 *                 updatedAt: "2023-10-02T00:00:00.000Z"
 *       400:
 *         description: Bad Request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Invalid input data"
 *               error: "Email is required"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Unauthorized: Invalid token"
 *       404:
 *         description: Not Found - User with the specified ID does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "User not found"
 *               error: "User with ID 12345 does not exist"
 *       500:
 *         description: Internal Server Error - Failed to update user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Failed to update user"
 *               error: "Database connection failed"
 */
router.put("/:id", updateUserById);
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update a single field of a user by ID
 *     description: Updates a single field of a user by their ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *         example: "12345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: The field to update (e.g., "name", "email", "password")
 *                 example: "name"
 *               value:
 *                 type: string
 *                 description: The new value for the field
 *                 example: "John Smith"
 *     responses:
 *       200:
 *         description: Successfully updated the user field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: true
 *               message: "User field updated successfully"
 *               data:
 *                 id: "12345"
 *                 name: "John Smith"
 *                 email: "john.doe@example.com"
 *                 status: "active"
 *                 createdAt: "2023-10-01T00:00:00.000Z"
 *                 updatedAt: "2023-10-02T00:00:00.000Z"
 *       400:
 *         description: Bad Request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Invalid input data"
 *               error: "Field and value are required"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Unauthorized: Invalid token"
 *       404:
 *         description: Not Found - User with the specified ID does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "User not found"
 *               error: "User with ID 12345 does not exist"
 *       500:
 *         description: Internal Server Error - Failed to update user field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Failed to update user field"
 *               error: "Database connection failed"
 */
router.patch("/:id", updateUserOneField);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Update user status to inactive (soft delete)
 *     description: Updates the status of a user to "inactive" (soft delete) by their ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to soft delete
 *         example: "12345"
 *     responses:
 *       200:
 *         description: Successfully updated the user status to inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: true
 *               message: "User status updated to inactive"
 *               data:
 *                 id: "12345"
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 status: "inactive"
 *                 createdAt: "2023-10-01T00:00:00.000Z"
 *                 updatedAt: "2023-10-02T00:00:00.000Z"
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Unauthorized: Invalid token"
 *       404:
 *         description: Not Found - User with the specified ID does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "User not found"
 *               error: "User with ID 12345 does not exist"
 *       500:
 *         description: Internal Server Error - Failed to update user status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseType'
 *             example:
 *               status: false
 *               message: "Failed to update user status"
 *               error: "Database connection failed"
 */
router.delete("/:id", updateStatusUser);

export default router;
