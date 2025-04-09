import express, { Request, Response } from "express";
import client from "prom-client";
import statusCode from "../constants/statusCode";
client.collectDefaultMetrics();

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).end(error);
  }
});

export default router;
