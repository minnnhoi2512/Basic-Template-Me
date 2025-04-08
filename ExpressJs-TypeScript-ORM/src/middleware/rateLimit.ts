import rateLimit from "express-rate-limit";
import { maxRequest, windowMs } from "../constants/limited";

const limiter = rateLimit({
  windowMs: windowMs, // 15 minutes
  max: maxRequest, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default limiter;
