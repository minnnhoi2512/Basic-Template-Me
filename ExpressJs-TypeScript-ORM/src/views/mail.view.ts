export const generateEmailTemplate = (
  subject: string,
  body: string,
  recipientName?: string
): string => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background-color: #4a90e2;
            padding: 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
            line-height: 1.6;
          }
          .content p {
            margin: 0 0 15px;
          }
          .footer {
            background-color: #f8f8f8;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
          .button {
            display: inline-block;
            padding: 12px 25px;
            background-color: #4a90e2;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${subject}</h1>
          </div>
          <div class="content">
            <p>Hello${recipientName ? " " + recipientName : ""},</p>
            <p>${body}</p>
            <a href="https://example.com" class="button">Learn More</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            <p><a href="mailto:${process.env.EMAIL_USER}">Contact Us</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
};
