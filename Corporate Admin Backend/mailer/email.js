const nodemailer = require('nodemailer');

async function sendUserCredentials(credentials) {
    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'developer@trymbayat.com',
                pass: 'waoyayqbfenmwrki',
            },
        });

        // Define the email content
        const mailOptions = {
            from: 'support@mbayat.com',
            to: credentials.email,
            subject: 'Mbayat Corporate Admin Login Credentials',
            text: `Here are your credentials:\n\nEmail: ${credentials.email}\nPassword: ${credentials.password} \n\n Thank You!`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('User credentials sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

async function sendCorporateResetPassword (email, password){
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'developer@trymbayat.com',
                pass: 'waoyayqbfenmwrki',
            },
        })

        const mailOptions = {
            from: 'support@mbayat.com',
            to: email,
            subject: 'Reset Password',
            text: `Your new password for Mbayat Corporate Admin Login is: ${password} \n\n Thank You!`,
        }

        await transporter.sendMail(mailOptions)
    } catch (e) {
        console.error('Failed to send email:', e);
        
    }
}


module.exports = {
    sendUserCredentials,
    sendCorporateResetPassword,
};