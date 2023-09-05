const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'sp241930@outlook.com',
        pass: 'pqudyvmdbitagqnb',
    },
});

const sendEmail = async (emailJob) => {
    try {
        // extract the email data from the job
        const { name, email } = emailJob.data;



        let mailDetails = {
            from: 'sp241930@outlook.com',
            to: 'sp241930@gmail.com',
            subject: 'Test mail',
            text: `Hello ${name}, welcome to MUO`
        };

        transporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });

        // mark task as completed in the queue
        await emailJob.moveToCompleted('done', true);
        console.log('Email sent successfully...');
    } catch (error) {
        // move the task to failed jobs
        await emailJob.moveToFailed({ message: 'task processing failed..' });
        console.error(error); // log the error
    }
}

module.exports = sendEmail;