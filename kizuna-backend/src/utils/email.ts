import nodemailer from 'nodemailer'

export const sendEmail = async (options: { email: string; subject: string; message: string; }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'adiyouaresosmart@gmail.com', 
            pass: process.env.TWO_PASS,  
        },
    });
    const mailOptions = {
        from: 'adiyouaresosmart@gmail.com', 
        to: options.email, 
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};
