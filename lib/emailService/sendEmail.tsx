import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your SMTP server
  port: 587, // Replace with your SMTP port
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your-email@example.com', // Replace with your email
    pass: 'your-email-password', // Replace with your email password
  },
});

export const sendBookingEmail = async (
  userEmail: string,
  carDetails: any,
  startDate: Date,
  endDate: Date
) => {
  const mailOptions = {
    from: 'your-email@example.com', // Replace with your email
    to: userEmail,
    subject: 'Car Booking Confirmation',
    text:
      `Your booking for the car ${carDetails.make} ${carDetails.model} has been confirmed!\n\n` +
      `Booking Details:\n` +
      `Car ID: ${carDetails._id}\n` +
      `Start Date: ${startDate.toISOString()}\n` +
      `End Date: ${endDate.toISOString()}\n\n` +
      `Thank you for choosing us!`,
  };

  await transporter.sendMail(mailOptions);
};
