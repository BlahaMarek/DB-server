const sendgridAPIKey = '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'

const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(sendgridAPIKey);

const sendEmail = (email, subject, text, html) => {
    const msg = {
      to: email,
      from: 'laboratorio@gmail.com',
      subject: subject,
      text: text,
      html: html,
    };
    sgMail.send(msg);
}

module.exports = {
    sendEmail
}