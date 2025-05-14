import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.newfeelventures.com", // make sure to get ssl
  // host: "server336.web-hosting.com", //has ssl
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "admin@newfeelventures.com",
    // pass: 5~R26v00(Yic
    pass: "Td6dPm8Ht7pLC6fDamVW"
  },
});

export async function sendPasswordResetLInk(email: string, title: string, name: string, link: string) {

  const info1 = await transporter.sendMail({
    from: "admin@newfeelventures.com", // sender address
    to: email, // list of receivers
    subject: title, // Subject line
    text: "Password Reset",
    html: "<!DOCTYPE html><html><head><meta charset='utf-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><title> Reset your Password</title><meta name='viewport' content='width=device-width, initial-scale=1'><link rel='stylesheet' type='text/css' media='screen' href='main.css'><script src='main.js'></script></head><body><div><p>Hello "+name+"</p><p>Your password reset link is here below, click the link to reset your account password </p><p>"+link+"</p><p>If you didnt make this request please ignore this email.</p><p>Regards<br/>Team at New Feel Ventures, @no-reply(do not reply to this email)</p></div></body></html>",
    // html: JSON.stringify(template(email, title))
  });

  console.log("Message sent: %s", info1.messageId);
}