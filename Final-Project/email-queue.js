// email-queue.js

const kue = require('kue');
const nodemailer = require('nodemailer');
const queue = kue.createQueue();

const addEmailJob = (emailData) => {
  const job = queue.create('email', emailData)
    .save((error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email job added to queue: ${emailData.email}`);
      }
    });


queue.process('email', async (job, done) => {
  const { email, subject, html } = job.data;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  // Send the email
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Newsletter email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending newsletter email to ${email}:`, error);
  }

  done(); // Mark the job as completed
});
};
module.exports = addEmailJob;
