const nodemailer = require('nodemailer');
const { createTransport } = require('nodemailer');

// Create a transporter with self-signed certificate support
const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Set secure to false to use TLS
    tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
    },
    auth: {
        user: 'developer@trymbayat.com',
        pass: 'waoyayqbfenmwrki',
    },
});

// Rest of your code...

async function sendUserCredentials(credentials) {
    try {
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

async function sendCorporateResetPassword(email, password) {
    try {
        // Define the email content
        const mailOptions = {
            from: 'support@mbayat.com',
            to: email,
            subject: 'Reset Password',
            text: `Your new password for Mbayat Corporate Admin Login is: ${password} \n\n Thank You!`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    sendUserCredentials,
    sendCorporateResetPassword,
};
