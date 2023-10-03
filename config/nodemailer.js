const nodemailer = require('nodemailer');
require("dotenv").config();

const smtpPass = process.env.SMTPPASS;
const PORT = process.env.port || 25;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com', 
    port: PORT,
    auth: {
        user: 'todoListOfficial5657@gmail.com',
        pass: smtpPass
    }
});

module.exports = transporter;
