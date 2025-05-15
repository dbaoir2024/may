import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  resetLink: string;
}

export const sendPasswordResetEmail = async ({ email, resetLink }: EmailOptions) => {
  // Create a test account if you don't have a real one
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || testAccount.user,
      pass: process.env.EMAIL_PASSWORD || testAccount.pass,
    },
  });

  const mailOptions = {
    from: `"Office of Industrial Registrar" <${process.env.EMAIL_FROM || 'no-reply@oir.gov'}>`,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Please click the following link to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.`,
    html: `
      <div>
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Please click the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return info;
};