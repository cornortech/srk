import { env } from "process";

import nodemailer, { SendMailOptions } from "nodemailer";

interface TSendEmailProps {
  subject: string;
  message: string;
  email: string;
  attachment?: any;
}

interface TEmailTemplateProps {
  heading: string;
  message: string;
  receiver_name?: string;
  link?: string;
  code?: string;
  password?: string;
  link_name?: string;
}

class EmailService {
  static async sendEmail({
    subject,
    message,
    email,
    attachment,
  }: TSendEmailProps) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        pass: env.SMTP_PW,
        user: process.env.APP_EMAIL,
      },
    });
    // Create personalized HTML content for each recipient
    let mailOptions: SendMailOptions = {
      from: '"SRK University" <' + process.env.APP_EMAIL + ">",
      to: email,
      subject: subject,
      text: subject,
      html: this.EmailTemplate({
        heading: subject,
        message: message,
      }),
    };
    console.log("sending email to ", email);

    if (attachment) {
      mailOptions.attachments = attachment;
    }

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log(`Email sent : ${info.messageId}`);
    } catch (error) {
      console.log(`Error sending email :`, error);
    }
  }

  static EmailTemplate({
    heading,
    message,
    receiver_name,
    link,
    code,
    password,
    link_name,
  }: TEmailTemplateProps) {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">

  <body style="margin: auto; font-family: Arial, sans-serif; padding: 1.5rem; color: #333;">
    <table align="center" width="100%" style="max-width: 600px; padding-top: 30px; background-color: white;">
      <tbody>
        <tr>
          <td style="padding: 20px; text-align: center;">
            <!-- Logo -->
            <img src="https://thesrkuniversity.com/logo/transparentLogo.png" alt="SRK University" style="max-width: 200px; margin-bottom: 20px;" />

            ${
              receiver_name
                ? `<p style="font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Dear ${receiver_name},</p>`
                : ""
            }

            ${
              message
                ? `<p style="font-size: 16px; line-height: 1.5; margin-bottom: 10px;">${message}</p>`
                : ""
            }

            ${
              code
                ? `<p style="background-color: #fcba03; padding: 10px; font-size: 16px; text-align: center; font-weight: bold; border-radius: 5px;">${code}</p>`
                : ""
            }

            ${
              password
                ? `<p style="font-size: 16px; font-weight: bold; text-align: center;">${password}</p>`
                : ""
            }

            ${
              link
                ? `<p style="text-align: center; margin-top: 20px;">
                     <a href="${link}" style="display: inline-block; background-color: black; color: #ebe134; text-decoration: none; padding: 10px 20px; border-radius: 5px;">${link_name}</a>
                   </p>`
                : ""
            }

            <p style="font-size: 14px; color: #555;">Best regards,<br>SRK University Team</p>

          </td>
        </tr>
      </tbody>
    </table>
  </body>

  </html>
`;

    return htmlContent;
  }
}

export default EmailService;
