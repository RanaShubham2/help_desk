import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
export const sendEmail = async (to,subject,body) => {
    const info = await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to,
        subject,
        text:body
    })
console.log("priview url:",nodemailer.getTestMessageUrl(info));
}
