import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { body } from 'src/utils/body';
import { body2 } from 'src/utils/bodyPostulation';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(datamailer): Promise<void> {
    await this._processSendEmail(
      datamailer.to,
      datamailer.subject,
      datamailer.text,
      body(datamailer.to, datamailer.subject, datamailer.text),
    );
  }

  async sendPostulation(datamailer) {
    await this._processSendEmail(
      datamailer.to,
      datamailer.subject,
      datamailer.text,
      datamailer.template,
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
