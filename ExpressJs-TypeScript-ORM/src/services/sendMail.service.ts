import nodemailer, { SendMailOptions } from "nodemailer";
import { redisClient } from "../config/redis.config";
import { logger } from "../config/logger.config";
import debug from "debug";
import { generateEmailTemplate } from "../views/mail.view";

const debugEmail = debug("email"); 
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

// Redis queue key
const EMAIL_QUEUE_KEY = "email:queue";

async function sendEmail(
  to: string,
  subject: string,
  body: string,
  options: {
    recipientName?: string;
    attachments?: SendMailOptions["attachments"];
    retries?: number;
  } = {}
): Promise<boolean> {
  const { recipientName, attachments, retries = 2 } = options;

  // Generate beautiful HTML content
  const html = generateEmailTemplate(subject, body, recipientName);

  // Email options
  const mailOptions: SendMailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments, // Optional attachments (e.g., files, images)
  };

  let attempt = 0;
  let lastError: Error | null = null;

  // Retry logic
  while (attempt <= retries) {
    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      debugEmail(`Email sent successfully to ${to} on attempt ${attempt + 1}`);
      return true;
    } catch (error: any) {
      lastError = error;
      attempt++;
      logger.warn(
        `Attempt ${attempt} failed for email to ${to}: ${error.message}`
      );
      debugEmail(`Email sending failed on attempt ${attempt}: ${error.message}`);

      if (attempt <= retries) {
        // Wait before retrying (exponential backoff: 1s, 2s, 4s, etc.)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // If all retries fail
  logger.error(
    `Failed to send email to ${to} after ${retries + 1} attempts: ${lastError?.message}`
  );
  debugEmail(`Email sending failed after all retries: ${lastError?.message}`);
  return false;
}

// Background email processing service
async function startEmailService() {
  logger.info(`Email Service worker ${process.pid} started`);
  debugEmail(`Starting email service on worker ${process.pid}`);

  try {
    await redisClient.connect(); // Ensure Redis is connected
    debugEmail("Connected to Redis for email queue");
    const isRunning = true;
    while (isRunning) {
      try {
        // Pop an email task from the Redis queue (blocking operation)
        // @redis/client brPop returns [key, value] or null
        const emailTask = await redisClient.brPop(EMAIL_QUEUE_KEY, 10); // Wait 10s for a task
        if (emailTask) {
          const { to, subject, body } = JSON.parse(emailTask.element); // emailTask[1] is the value
          debugEmail(`Processing email for ${to}`);

          const success = await sendEmail(to, subject, body);
          if (!success) {
            // Re-queue the email if sending failed
            await redisClient.lPush(
              EMAIL_QUEUE_KEY,
              JSON.stringify({ to, subject, body })
            );
            logger.warn(`Re-queued email for ${to} due to failure`);
          }
        } else {
          debugEmail("No emails in queue, waiting...");
        }
      } catch (error: any) {
        logger.error(`Email service error: ${error.message}`);
        debugEmail(`Error in email processing loop: ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5s before retrying
      }
    }
  } catch (error:any) {
    logger.error(`Email Service failed to start: ${error.message}`);
    debugEmail(`Service startup failed: ${error.message}`);
    process.exit(1);
  }
}

// Function to queue an email (to be used by other parts of the app)
export async function queueEmail(
  to: string,
  subject: string,
  body: string
): Promise<void> {
  try {
    await redisClient.lPush(
      EMAIL_QUEUE_KEY,
      JSON.stringify({ to, subject, body })
    );
    logger.info(`Email queued for ${to}`);
    debugEmail(`Email queued: ${to}, ${subject}`);
  } catch (error: any) {
    logger.error(`Failed to queue email for ${to}: ${error.message}`);
    debugEmail(`Queueing failed: ${error.message}`);
    throw error;
  }
}

export { startEmailService };
