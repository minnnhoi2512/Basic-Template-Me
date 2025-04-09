import nodemailer from "nodemailer";
import { redisClient } from "../config/redis.config";
import { logger } from "../config/logger.config";
import debug from "debug";

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
  body: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    debugEmail(`Email sent successfully to ${to}`);
    return true;
  } catch (error: any) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    debugEmail(`Email sending failed: ${error.message}`);
    return false;
  }
}

// Background email processing service
async function startEmailService() {
  logger.info(`Email Service worker ${process.pid} started`);
  debugEmail(`Starting email service on worker ${process.pid}`);

  try {
    await redisClient.connect(); // Ensure Redis is connected
    debugEmail("Connected to Redis for email queue");

    while (true) {
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
