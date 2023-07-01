// send-newsletter.js
const User = require('./models/user');

const addEmailJob = require('./email-queue');
async function sendNewsletter() {
  try {
    // Fetch user email addresses and newsletter content
    const users = await User.find({});

    for (const user of users) {
      const emailData = {
        email: user.email,
        subject: 'Newsletter',
        html: `
        <html>
        <head>
          <style>
            /* CSS styles for the newsletter */
          </style>
        </head>
        <body>
          <h1>Welcome to our Newsletter!</h1>
          <p>Dear valued user,</p>
          <p>We are delighted to share with you the latest updates and news from our platform.</p>
          <p>Here are some highlights:</p>
          <ul>
            <li>New feature releases</li>
            <li>Upcoming events and promotions</li>
            <li>Tips and tricks to maximize your experience</li>
          </ul>
          <p>Stay tuned for more exciting updates!</p>
          <p>Best regards,</p>
          <p>The Newsletter Team</p>
        </body>
      </html>
        `
      };
      

      // Enqueue the email job
      addEmailJob(emailData);
    }
  } catch (error) {
    console.error('Error sending newsletter emails:', error);
  }
}

module.exports = sendNewsletter;
