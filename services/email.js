const Mailgen = require('mailgen');
const config = require('../config/email.json');

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case 'development':
        this.link = config.dev;
      case 'prodaction':
        this.link = config.prod;
        break;
      default:
        break;
    }
  }
  #createTemplateVerifyEmail(verificationToken, name) {
    const mailGenerator = new Mailgen({
      theme: 'neopolitan',
      product: {
        name: 'Contacts',
        link: this.link,
      },
    });

    const email = {
      body: {
        name: 'Contacts',
        intro: "Welcome to Mailgen! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Mailgen, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/auth/verify/${verificationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(email);
  }
  async sendVerifyPasswordEmail(verificationToken, email, name) {
    const emailBody = this.createTemplateVerifyEmail(verificationToken, name);
    const result = await this.sender.send({
      to: email,
      subject: 'Verify  your Account',
      html: emailBody,
    });
  }
}

module.exports = EmailService;
