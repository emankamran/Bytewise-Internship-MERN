const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user'); 
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 5000;

const sendNewsletter = require('./send-newsletter');
// const { CronJob } = require('cron');
const cron = require('node-cron');
const fileUpload = require('express-fileupload');
require('dotenv').config();

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB!');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});

require('./models/user');
require('./models/post');
require('./models/chatroom');
require('./models/message');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  })
);
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));
app.use(require('./routes/chat'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


const server = app.listen(PORT, () => {
  console.log('Server is running on', PORT);
});


const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const jwt = require('jsonwebtoken');

// Import the Message and Chatroom models
const Message = require('./models/message');
const Chatroom = require('./models/chatroom');

io.use(async (socket, next) => {
  const token = socket.handshake.query.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return new Error('Authentication error');
    }
    const { _id } = payload;
    socket.userId = _id;
  });
next();
});

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });

  socket.on('send_message', async (dataString) => {
    console.log('Received message from a client:', dataString);

    // Parse the data string into an object
    const data = JSON.parse(dataString);

    // Check if all required fields are present
    if (data.username && data.message && data.createdDate) {
      // Access the message property from the data object
      const messageContent = data.message;
      const username = data.username;
      const date = data.createdDate;

      try {
        // Save the message to MongoDB
        const message = new Message({
          
          user: username,
          message: messageContent,
		  date
        });

        message.save((err, savedMessage) => {
          if (err) {
            console.error('Error saving message:', err);
          } else {
            console.log('Message saved:', savedMessage);

            // Broadcast to all users in the same chatroom
            io.sockets.emit('receive_message', dataString);
          }
        });
      } catch (err) {
        console.error('Error saving message:', err);
      }
    } else {
      console.error('Required fields missing in the message data.');
    }
  });
});


// Schedule the newsletter job using a cron expression


cron.schedule('0 0 */5 * *', async () => {
  try {
    await sendNewsletter();
  } catch (error) {
    console.error('Error fetching users:', error);
  }
});

  