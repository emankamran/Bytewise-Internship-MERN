const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require("dotenv").config();
const requireLogin = require('../middleWare/requireLogin');

const nodemailer = require("nodemailer");




// send mail
router.post("/register",  (req, res) => {

    const { email } = req.body;
  

    try {

        

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Sending Email With React And Nodejs",
            html: '<h1>Congratulation</h1> <h1> You successfully sent Email </h2>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error" + error)
            } else {
                console.log("Email sent:" + info.response);
                res.status(201).json({status:201,info})
            }
        })

    } catch (error) {
        console.log("Error" + error);
        res.status(401).json({status:401,error})
    }
});


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post('/signup', (req, res) => {
  const { name, email, password, propic } = req.body;

  if (!email || !name || !password) {
    return res.status(422).json({ error: "please fill all the fields" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exists with the given email id" });
      }
      bcrypt.hash(password, 12)
        .then(hashedpassword => {
          const user = new User({
            email,
            password: hashedpassword,
            name,
            pic: propic
          });
          user.save()
            .then(user => {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: user.email,
                    subject: "Do not reply to this email",
                    html: '<h1>Welcome to IInstagram</h1>',
                };
            
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent:', info.response);
                }
              });
              res.json({ message: "saved user successfully ^_^" });
            })
            .catch(err => {
              console.log(err);
            });
        });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }

  User.findOne({ email: email })
    .then(savedUser => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email or password" });
      }
      bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
            const { _id, name, email } = savedUser;
            res.json({ token, user: { _id, name, email } });
          }
          else {
            return res.status(422).json({ error: "Invalid Email or password" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
});

router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(422).json({ error: "User doesn't exist with the given email" });
        }

        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user.markModified('resetToken');
        user.markModified('expireToken');
        user.save().then((result) => {
            const mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: "Password Reset",
                html: `
                <p>You have requested a password reset</p>
                <h5>Click this <a href="${process.env.HOSTEDLOCALHOST}/reset/${token}">link</a> to reset your password</h5>
              `
                
            };
          
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent:', info.response);
            }
          });
          res.json({ message: "Check your email for password reset instructions" });
        });
      });
  });
});

router.post('/new-password', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;

  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        return res.status(422).json({ error: "Try again! Session may have expired" });
      }

      bcrypt.hash(newPassword, 12).then(hashedpassword => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.markModified('password');
        user.markModified('resetToken');
        user.markModified('expireToken');
        user.save().then((saveduser) => {
          res.json({ message: "Password updated successfully" });
        });
      });

    }).catch(err => {
      console.log(err);
    });
});

module.exports = router;
