const sgMail = require('@sendgrid/mail');
const config = require('../config/email.json');

require('dotenv').config();

class CreateSenderSendGrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({ ...msg, from: config.emailSg });
  }
}

module.exports = { CreateSenderSendGrid };
