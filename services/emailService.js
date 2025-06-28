const nodemailer = require('nodemailer');

/**
 * Create a nodemailer transporter
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send a registration confirmation email
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Nodemailer response
 */
const sendRegistrationEmail = async (user) => {
  const { email, name } = user;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Event Management Platform',
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for registering with our Event Management Platform.</p>
      <p>You can now log in and start exploring events or create your own!</p>
      <p>Best regards,</p>
      <p>The Event Management Team</p>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

/**
 * Send an event registration confirmation email
 * @param {Object} user - User object
 * @param {Object} event - Event object
 * @returns {Promise<Object>} - Nodemailer response
 */
const sendEventRegistrationEmail = async (user, event) => {
  const { email, name } = user;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Registration Confirmed: ${event.name}`,
    html: `
      <h1>Registration Confirmed</h1>
      <p>Hello ${name},</p>
      <p>Your registration for <strong>${event.name}</strong> has been confirmed.</p>
      <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p>We look forward to seeing you there!</p>
      <p>Best regards,</p>
      <p>The Event Management Team</p>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendRegistrationEmail,
  sendEventRegistrationEmail
}; 