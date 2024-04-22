const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

module.exports = {
  postEmailUsername: async (req, res) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const today = Date.parse(new Date());
    //Convert base 36
    const ident = parseInt(req.body[1], 36);
    const secretKey = async () => {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body[0], salt);

      if (hash.includes("/")) {
        return await secretKey();
        //hash = await secretKey();
      }
      return hash;
    };

    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Capital One" <no-reply@jameshlo.com>', // sender address
        to: `${req.body[0]}`, // list of receivers
        subject: "Capital One Username", // Subject line
        text: `Your Capital One username is ${req.body[1]}`, // plain text body
        html: `Your Capital One username is <b>${req.body[1]}</b><br/>
                If you wish to reset your password, please use this link: <a href=http://localhost:3000/reset-password/${ident}/${today}/${await secretKey()}>here</a> `, // html body
      });
      res.status(200).json("Email containing username sent!");
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    } catch (error) {
      console.log(error);
      res.status(400).json("Error sending email");
    }
  },
};
