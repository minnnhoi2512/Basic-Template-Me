import { Request, Response, Router } from "express";
import { generateApiKey, storeApiKey } from "../utils/apiKey";
import statusCode from "../constants/statusCode";
import { getUserByIdRepository } from "../repositories/user.repository";

const router = Router();

/**
 * @swagger
 * /api/v1/apiKey:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Generate a new API key for a user
 *     description: Creates a new API key for a specified user ID and stores it in Redis. Returns the generated API key.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user for whom the API key is generated
 *                 example: "user_123"
 *     responses:
 *       201:
 *         description: API key successfully generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: The generated API key
 *                   example: "abc4567890def1234567890abcdef123"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
router.post("/apiKey", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await getUserByIdRepository(userId);
    if (!user) {
      res.status(statusCode.NOT_FOUND).json({
        status: false,
        message: "User not found",
      });
      return;
    }
    const apiKey = generateApiKey();
    await storeApiKey(apiKey, userId.toString());
    res.status(statusCode.CREATED).json({ apiKey });
  } catch (error: any) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", detail: error.message });
  }
});

export default router;
