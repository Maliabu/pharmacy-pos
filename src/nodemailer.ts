import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "mail.beerasafe.com", // make sure to get ssl
  // host: "server336.web-hosting.com", //has ssl
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "support@beerasafe.com",
    // pass: 5~R26v00(Yic
    pass: "fi(bO})$06&("
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(email: string, title: string, name: string) {
    // const filePath = path.resolve('./src', 'htmlTemplate.html')
    // let htmlData = fs.readFileSync(filePath, 'utf8');
    // htmlData = htmlData.replace('email', email)

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "support@beerasafe.com", // sender address
    to: "support@beerasafe.com", // list of receivers
    subject: "Request For "+title, // Subject line
    text: "Services",
    html: "<!DOCTYPE html><html><head><meta charset='utf-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><title>Request for Service</title><meta name='viewport' content='width=device-width, initial-scale=1'><link rel='stylesheet' type='text/css' media='screen' href='main.css'><script src='main.js'></script></head><body><div><p>Hello Beera Safe Team</p><p>A request for service has been sent with the following details: </p><p>Service Requested: "+title+"<br/>Requesting Customer: "+email+"</p><p>Regards<br/>Beera Safe automated @no-reply</p></div></body></html>",
    // html: JSON.stringify(template(email, title))
  });
  const info1 = await transporter.sendMail({
    from: "support@beerasafe.com", // sender address
    to: email, // list of receivers
    subject: "Request For "+title, // Subject line
    text: "Services",
    html: "<!DOCTYPE html><html><head><meta charset='utf-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><title>Request for Service</title><meta name='viewport' content='width=device-width, initial-scale=1'><link rel='stylesheet' type='text/css' media='screen' href='main.css'><script src='main.js'></script></head><body><div><p>Hello "+name+"</p><p>Your request for service has been sent with the following details: </p><p>Service Requested: "+title+"<br/>Requesting Customer: "+email+"</p><p>Thank you for your request and we will get back to you shortly.</p><p>Regards<br/>Beera Safe automated @no-reply</p></div></body></html>",
    // html: JSON.stringify(template(email, title))
  });

  console.log("Message sent: %s", info.messageId, info1.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// export async function sendEmail(req: { email: string, title:string }) {

// const transporter = nodemailer.createTransport({
//     port: 465,
//     host: "server336.web-hosting.com",
//     auth: {
//         user: "support@beerasafe.com",
//         pass: "fi(bO})$06&(",
//     },
//     secure: true,
// });

// await new Promise((resolve, reject) => {
//     // verify connection configuration
//     transporter.verify(function (error: any, success: unknown) {
//         if (error) {
//             console.log(error);
//             reject(error);
//         } else {
//             console.log("Server is ready to take our messages");
//             resolve(success);
//         }
//     });
// });
// const filePath = path.resolve('./src', 'htmlTemplate.html')
// let htmlData = fs.readFileSync(filePath, 'utf8');
// htmlData = htmlData.replace('email', req.email)

// const mailData = {
//     from: "support@beerasafe.com",
//     replyTo: req.email,
//     to: req.email,
//     subject: "Request For "+req.title,
//     html: htmlData,
// };

// await new Promise((resolve, reject) => {
//     // send mail
//     transporter.sendMail(mailData, (err: any, info: unknown) => {
//         if (err) {
//             console.error(err);
//             reject(err);
//         } else {
//             console.log(info);
//             resolve(info);
//         }
//     });
// });

// // res.status(200).json({ status: "OK" });
// };