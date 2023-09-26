const nodemailer = require('nodemailer');
require("dotenv").config();

const smtpPass = process.env.SMTPPASS;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 25,
    auth: {
        user: 'todoListOfficial5657@gmail.com',
        pass: smtpPass
    }
});

module.exports = transporter;
