import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const generateSixDigitCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        background: #0a0a0a;
        font-family: 'Arial Black', sans-serif;
        color: #f0f0f0;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 480px;
        margin: 40px auto;
        background: #121212;
        border: 1px solid #2a2a2a;
        border-radius: 8px;
        overflow: hidden;
      }

      .header {
        background: #0a0a0a;
        padding: 24px 32px;
        border-bottom: 1px solid #2a2a2a;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 900;
        letter-spacing: 1px;
        color: #ffffff;
        text-transform: uppercase;
      }

      .body {
        padding: 32px;
      }

      .heading {
        font-size: 22px;
        font-weight: 900;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #ffffff;
        margin: 0 0 8px;
      }

      .subtext {
        font-size: 14px;
        color: #888888;
        line-height: 1.6;
        margin: 0 0 28px;
      }

      .code-block {
        background: #0a0a0a;
        border: 1px solid #2a2a2a;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        margin-bottom: 24px;
      }

      .code {
        font-size: 40px;
        font-weight: 900;
        letter-spacing: 12px;
        color: #ffffff;
        font-family: 'Courier New', monospace;
      }

      .expiry {
        font-size: 12px;
        color: #555555;
        margin-top: 10px;
      }

      .footer {
        padding: 16px 32px;
        border-top: 1px solid #1a1a1a;
        font-size: 11px;
        color: #444444;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <span class="logo-text">Rate That Baller</span>
      </div>

      <div class="body">
        ${content}
      </div>

      <div class="footer">
        Rate That Baller · Football Community Ratings · Do not reply to this email
      </div>
    </div>
  </body>
</html>
`;

export const sendVerificationEmail = async (email, username, code) => {
    const html = emailWrapper(`
    <p class="heading">Verify Your Email</p>

    <p class="subtext">
      Hey ${username}, enter this code in the app to verify your email address
      and activate your account.
    </p>

    <div class="code-block">
      <div class="code">${code}</div>
      <div class="expiry">Expires in 15 minutes</div>
    </div>

    <p style="font-size:12px; color:#555555; margin:0;">
      If you didn't create a Rate That Baller account, you can safely ignore this email.
    </p>
  `);

    await transporter.sendMail({
        from: `"Rate That Baller" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your verification code — Rate That Baller',
        html,
    });
};

export const sendPasswordResetEmail = async (email, username, code) => {
    const html = emailWrapper(`
    <p class="heading">Reset Your Password</p>

    <p class="subtext">
      Hey ${username}, use this code to reset your Rate That Baller password.
      If you did not request this, ignore this email.
    </p>

    <div class="code-block">
      <div class="code">${code}</div>
      <div class="expiry">Expires in 10 minutes</div>
    </div>

    <p style="font-size:12px; color:#555555; margin:0;">
      For your security, this code can only be used once and will expire automatically.
    </p>
  `);

    await transporter.sendMail({
        from: `"Rate That Baller" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password reset code — Rate That Baller',
        html,
    });
};