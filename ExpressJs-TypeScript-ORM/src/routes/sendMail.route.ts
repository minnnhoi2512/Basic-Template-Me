import express from "express";
import { queueEmail } from "../services/sendMail.service";
import statusCode from "../constants/statusCode";

const router = express.Router();

router.post("/send-email", async (req, res) => {
//   const { to, subject, body } = req.body;
  try {
    await queueEmail("mhoinguyen2512@gmail.com", "Test Subject", "<p>Test Body</p>");
    res.status(statusCode.OK).json({ message: "Email queued successfully" });
  } catch (error: any) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to queue email", detail: error.message });
  }
});

export default router;
