import nodemailer from 'nodemailer';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function validateEnv(): Env | null {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const secureRaw = process.env.SMTP_SECURE;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM;

  const isPlaceholder = (value: string | undefined) =>
    !value ||
    value.startsWith('your-') ||
    value.startsWith('tvoj') ||
    value.includes('example.com');

  if (
    isPlaceholder(host) ||
    !portRaw ||
    isPlaceholder(secureRaw) ||
    isPlaceholder(user) ||
    isPlaceholder(pass) ||
    isPlaceholder(from)
  ) {
    return null;
  }

  const hostStr = host as string;
  const secureStr = secureRaw as string;
  const userStr = user as string;
  const passStr = pass as string;
  const fromStr = from as string;

  const port = Number(portRaw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be a valid port number');
  }

  const secure = secureStr === 'true';
  if (secureStr !== 'true' && secureStr !== 'false') {
    throw new Error('SMTP_SECURE must be true or false');
  }

  return {
    host: hostStr,
    port,
    secure,
    user: userStr,
    pass: passStr,
    from: fromStr,
  };
}

let transporter: nodemailer.Transporter | null = null;

type Env = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

let cachedEnv: Env | null = null;

function getEnv(): Env | null {
  if (cachedEnv === null) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (!transporter) {
    const env = getEnv();
    if (env) {
      const { host, port, secure, user, pass } = env;
      transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    } else {
      // No SMTP credentials configured: spin up a free Ethereal test account
      // so the app still works locally. Emails are not delivered for real,
      // a preview URL is logged instead.
      const account = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: account.user, pass: account.pass },
      });
    }
  }
  return transporter;
}

function formatUtcDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
}

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function sendMail(options: SendMailOptions): Promise<void> {
  const env = getEnv();
  const from = env ? env.from : 'Rent My Car <no-reply@rent-my-car.app>';
  const info = await (
    await getTransporter()
  ).sendMail({
    from,
    ...options,
  });

  if (process.env.NODE_ENV !== 'production') {
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log(`📧 Email preview (Ethereal): ${preview}`);
    }
  }
}

export async function sendBookingConfirmationToCustomer({
  customerEmail,
  customerName,
  carName,
  startDate,
  endDate,
  pickupLocation,
}: {
  customerEmail: string;
  customerName: string;
  carName: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
}): Promise<void> {
  const safeCustomerName = escapeHtml(customerName);
  const safeCarName = escapeHtml(carName);
  const safeLocation = escapeHtml(pickupLocation);
  const formattedStart = formatUtcDate(startDate);
  const formattedEnd = formatUtcDate(endDate);

  const text =
    `Hi ${customerName},\n\n` +
    `Your booking for ${carName} has been confirmed!\n\n` +
    `Pickup Date: ${formattedStart}\n` +
    `Return Date: ${formattedEnd}\n` +
    `Location: ${pickupLocation}\n\n` +
    `Thank you for booking with us!`;

  const html = `
    <h1>Booking Confirmed</h1>
    <p>Hi ${safeCustomerName},</p>
    <p>Your booking for <strong>${safeCarName}</strong> has been confirmed!</p>
    <ul>
      <li><strong>Pickup Date:</strong> ${formattedStart}</li>
      <li><strong>Return Date:</strong> ${formattedEnd}</li>
      <li><strong>Location:</strong> ${safeLocation}</li>
    </ul>
    <p>Thank you for booking with us!</p>
  `;

  await sendMail({
    to: customerEmail,
    subject: `Booking Confirmed: ${carName}`,
    html,
    text,
  });
}

export async function sendBookingNotificationToOwner({
  email,
  ownerName,
  carName,
  customerName,
  customerEmail,
  startDate,
  endDate,
}: {
  email: string;
  ownerName: string;
  carName: string;
  customerName: string;
  customerEmail: string;
  startDate: Date;
  endDate: Date;
}): Promise<void> {
  const safeOwnerName = escapeHtml(ownerName);
  const safeCarName = escapeHtml(carName);
  const safeCustomerName = escapeHtml(customerName);
  const safeCustomerEmail = escapeHtml(customerEmail);
  const formattedStart = formatUtcDate(startDate);
  const formattedEnd = formatUtcDate(endDate);

  const text =
    `Hi ${ownerName},\n\n` +
    `New Booking Notification\n\n` +
    `Car: ${carName}\n` +
    `Customer: ${customerName} (${customerEmail})\n` +
    `Start Date: ${formattedStart}\n` +
    `End Date: ${formattedEnd}\n\n` +
    `Your car has been booked!`;

  const html = `
    <h1>New Booking Notification</h1>
    <p>Hi ${safeOwnerName},</p>
    <p>Your car has been booked. Here are the details:</p>
    <ul>
      <li><strong>Car:</strong> ${safeCarName}</li>
      <li><strong>Customer:</strong> ${safeCustomerName} (${safeCustomerEmail})</li>
      <li><strong>Start Date:</strong> ${formattedStart}</li>
      <li><strong>End Date:</strong> ${formattedEnd}</li>
    </ul>
    <p>Your car has been booked!</p>
  `;

  await sendMail({
    to: email,
    subject: `New Booking Notification: ${carName}`,
    html,
    text,
  });
}

export async function sendEmailVerification({
  email,
  token,
  appUrl,
}: {
  email: string;
  token: string;
  appUrl: string;
}): Promise<void> {
  const url = new URL('/verify-email', appUrl);
  url.searchParams.set('token', token);
  const verificationLink = url.toString();
  const safeVerificationLink = escapeHtml(verificationLink);

  const text =
    `Please verify your email address\n\n` +
    `Click the link below to verify your email:\n` +
    `${verificationLink}\n\n` +
    `This link will expire in 24 hours.\n` +
    `If you did not create an account, you can safely ignore this email.`;

  const html = `
    <h1>Verify your email</h1>
    <p>Click the button below to verify your email address:</p>
    <p>
      <a href="${safeVerificationLink}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;">
        Verify Email
      </a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p>${safeVerificationLink}</p>
    <p>This link will expire in 24 hours.</p>
    <p>If you did not create an account, you can safely ignore this email.</p>
  `;

  await sendMail({
    to: email,
    subject: 'Verify your email address',
    html,
    text,
  });
}

export async function sendCancellationNotificationToCustomer({
  customerEmail,
  customerName,
  carName,
  startDate,
  endDate,
  cancelledByName,
}: {
  customerEmail: string;
  customerName: string;
  carName: string;
  startDate: Date;
  endDate: Date;
  cancelledByName: string;
}): Promise<void> {
  const safeCustomerName = escapeHtml(customerName);
  const safeCarName = escapeHtml(carName);
  const safeCancelledByName = escapeHtml(cancelledByName);
  const formattedStart = formatUtcDate(startDate);
  const formattedEnd = formatUtcDate(endDate);

  const text =
    `Hi ${customerName},\n\n` +
    `Your reservation for ${carName} has been cancelled by ${cancelledByName}.\n\n` +
    `Pickup Date: ${formattedStart}\n` +
    `Return Date: ${formattedEnd}\n\n` +
    `The reservation has been cancelled.\n\n` +
    `If you have any questions, please contact us.`;

  const html = `
    <h1>Reservation Cancelled</h1>
    <p>Hi ${safeCustomerName},</p>
    <p>Your reservation for <strong>${safeCarName}</strong> has been <strong>cancelled</strong> by ${safeCancelledByName}.</p>
    <ul>
      <li><strong>Pickup Date:</strong> ${formattedStart}</li>
      <li><strong>Return Date:</strong> ${formattedEnd}</li>
    </ul>
    <p>The reservation has been cancelled.</p>
    <p>If you have any questions, please contact us.</p>
  `;

  await sendMail({
    to: customerEmail,
    subject: `Reservation Cancelled: ${carName}`,
    html,
    text,
  });
}

export async function sendCancellationNotificationToOwner({
  email,
  ownerName,
  carName,
  customerName,
  startDate,
  endDate,
  cancelledByName,
}: {
  email: string;
  ownerName: string;
  carName: string;
  customerName: string;
  startDate: Date;
  endDate: Date;
  cancelledByName: string;
}): Promise<void> {
  const safeOwnerName = escapeHtml(ownerName);
  const safeCarName = escapeHtml(carName);
  const safeCustomerName = escapeHtml(customerName);
  const safeCancelledByName = escapeHtml(cancelledByName);
  const formattedStart = formatUtcDate(startDate);
  const formattedEnd = formatUtcDate(endDate);

  const text =
    `Hi ${ownerName},\n\n` +
    `A reservation for ${carName} has been cancelled by ${cancelledByName}.\n\n` +
    `Customer: ${customerName}\n` +
    `Start Date: ${formattedStart}\n` +
    `End Date: ${formattedEnd}\n\n` +
    `The reservation has been cancelled.`;

  const html = `
    <h1>Reservation Cancelled</h1>
    <p>Hi ${safeOwnerName},</p>
    <p>A reservation for <strong>${safeCarName}</strong> has been <strong>cancelled</strong> by ${safeCancelledByName}.</p>
    <ul>
      <li><strong>Customer:</strong> ${safeCustomerName}</li>
      <li><strong>Start Date:</strong> ${formattedStart}</li>
      <li><strong>End Date:</strong> ${formattedEnd}</li>
    </ul>
    <p>The reservation has been cancelled.</p>
  `;

  await sendMail({
    to: email,
    subject: `Reservation Cancelled: ${carName}`,
    html,
    text,
  });
}

export async function sendPasswordResetEmail({
  email,
  token,
  appUrl,
}: {
  email: string;
  token: string;
  appUrl: string;
}): Promise<void> {
  const url = new URL('/reset-password', appUrl);
  url.searchParams.set('token', token);
  const resetLink = url.toString();
  const safeResetLink = escapeHtml(resetLink);

  const text =
    `Password Reset Request\n\n` +
    `We received a request to reset your password.\n` +
    `Click the link below to choose a new password:\n` +
    `${resetLink}\n\n` +
    `This link will expire in 1 hour.\n` +
    `If you did not request this, you can safely ignore this email.`;

  const html = `
    <h1>Reset your password</h1>
    <p>We received a request to reset your password.</p>
    <p>
      <a href="${safeResetLink}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;">
        Reset Password
      </a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p>${safeResetLink}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request this, you can safely ignore this email.</p>
  `;

  await sendMail({
    to: email,
    subject: 'Reset your password',
    html,
    text,
  });
}
