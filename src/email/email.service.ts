import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(datamailer): Promise<void> {
    await this._processSendEmail(
      datamailer.to,
      datamailer.subject,
      datamailer.text,
      `<!DOCTYPE html>
<html>

<head>
  <link href="https://fonts.googleapis.com/css?family=Gotham:400,500,700" rel="stylesheet">
  <style>
    body {
      font-family: 'Gotham', sans-serif;
    }

    .container {
      width: 500px;
      margin: 70px auto 0;
      text-align: center;
    }

    h2 {
      text-align: center;
      font-weight: 600;
    }

    .text {
      text-align: justify;
      font-weight: 20px;
    }

    .text p {
      margin-top: 10px;
      margin-bottom: 10px;
      color: #41404699;
      font-size: 16px;
      font-weight: 400;
    }

    .copyright {
      text-align: center;
      font-size: 0.8em;
      font-weight: 600;
    }
  </style>
</head>

<body>
  <div class="container">
    <h2>${datamailer.to}</h2>

    <div class="text">
      <p>Regards! :</p>
      <p>${datamailer.text}</p>
    </div>

    <hr style="border: 1px solid #ccc; color: #41404626; margin-top: 70px; margin-bottom: 20px;">

    <div class="copyright">
      <p>My App {{ data.year }} ©. All rights reserved.</p>
    </div>
  </div>
</body>

</html>`,
    );
  }
  async _processSendEmail(to, subject, text, body): Promise<void> {
    await this.mailerService
      .sendMail({
        to: to,
        subject: subject,
        text: text,
        html: body,
      })
      .then(() => {
        console.log('Email sent');
      })
      .catch((e) => {
        console.log('Error sending email', e);
      });
  }
}
