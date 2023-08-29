const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'sp241930@outlook.com',
    pass: 'pqudyvmdbitagqnb',
  },
});

let mailDetails = {
  from: 'sp241930@outlook.com',
  to: 'sp241930@gmail.com',
  subject: 'Test mail',
  text: 'Node.js testing mail for GeeksforGeeks',
};

mailTransporter.sendMail(
  mailDetails,
  function (err, data) {
    if (err) {
      console.log(err);
      console.log('Error Occurs');
    } else {
      console.log('Email sent successfully');
    }
  },
);
