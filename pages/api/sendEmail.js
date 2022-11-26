const sgMail = require("@sendgrid/mail");

export default function handler(req, res) {
  return new Promise((resolve) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { message, to, subject } = req.body;

    const msg = {
      to: to,
      from: "sfsustudypartner@gmail.com",
      subject: subject,
      text: message,
    };
    sgMail
      .sendMultiple(msg)
      .then(() => {
        res.send(200);
        return resolve();
      })
      .catch((error) => {
        res.status(500).send("Error occured while sending email");
        return resolve();
      });
  });
}
