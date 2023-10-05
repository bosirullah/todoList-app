require("dotenv").config();

const apiKey = process.env.APIKEY;
const apiSecretKey = process.env.APISECRETKEY;
const mailjet = require('node-mailjet').apiConnect(apiKey, apiSecretKey);


async function sendEmail(userEmail, callback) {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
        {
            From: {
                Email: 'todoListOfficial5657@gmail.com',
                Name: 'todoList App',
            },
            To: [
                {
                    Email: userEmail,
                },
            ],
            Subject: 'Reminder',
            TextPart: 'Your task is due for today',
            HTMLPart: '<p>Your task is due for today</p>',
        },
        ],
    });

    try {
        const response = await request;
        console.log('Email sent successfully:', response.body);
        callback(null); // No error, email sent successfully
    } catch (error) {
        console.error('Error sending email:', error);
        callback(error);
    }
}

module.exports = sendEmail;
