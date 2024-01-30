const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();

const port = process.env.PORT || 6000;

app.use('/v1', route);

app.listen(port, () => {
    console.log(process.env.MAIL_USER)
    console.log(`Server listening on port ${port}`);
});


const transporter = nodemailer.createTransport({
    port: 465,
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

route.post('/text-mail', (req, res) => {
    const {to, subject, text } = req.body;
    console.log(req.body);
    const mailData = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: subject,
        text: text,
        html: `<html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>OTP Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6rem;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h2>Verifikasi Email dengan One-Time Password (OTP)</h2>
            <p>Silakan gunakan kode berikut untuk verifikasi:</p>
            <div style="padding: 15px; border: 1px solid #ccc; background-color: #f5f5f5;">
              <h3 style="margin-top: 0;">Kode Verifikasi:</h3>
              <p style="font-size: 24px; padding: 10px 20px; background-color: #fff; border-radius: 5px; border: 1px solid #ccc;">
                <strong>${text}</strong>
              </p>
            </div>
            <p style="margin-top: 20px;">Terima kasih atas kepercayaan Anda.</p>
            <p>Salam,<br>${process.env.APP_NAME}</p>
          </div>
        </body>
        </html>`,
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
});