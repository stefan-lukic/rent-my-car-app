import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'rentmycarnotificationservice@gmail.com',
    pass: 'RentMyCar.12345!',
  },
});

export const sendBookingEmail = async (
  userEmail: string,
  carDetails: any,
  startDate: Date,
  endDate: Date
) => {
  const mailOptions = {
    from: 'rentmycarnotificationservice@gmail.com',
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
