import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

// import * as sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { SendMailOptions } from './interfaces/send-email.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = configService.get<string>('app.sendGrid.apiKey');
    if (!apiKey) {
      throw new Error('SendGrid API key is missing in environment variables');
    }
    sgMail.setApiKey(apiKey);

    this.fromEmail =
      this.configService.get<string>('app.sendGrid.senderEmail') ||
      'no-reply@example.com';
    this.baseUrl =
      this.configService.get<string>('app.frontendDomain') ||
      'https://rumor.app';
  }

  /**
   * Send email using a local HTML template and dynamic variables.
   */
  async sendMail(options: SendMailOptions): Promise<void> {
    const { to, subject, templateName, variables } = options;

    const html = await this.renderTemplate(templateName, variables);

    const msg: sgMail.MailDataRequired = {
      to,
      from: this.fromEmail,
      subject,
      html,
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`✅ Email sent to ${to} using template ${templateName}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reads and compiles a Handlebars HTML template.
   */
  private async renderTemplate(
    templateName: string,
    variables: Record<string, any>,
  ): Promise<string> {
    // const templatePath = path.join(
    //   __dirname,
    //   'templates',
    //   `${templateName}.html`,
    // );
    const templatePath = path.join(
      process.cwd(),
      'src',
      'emails',
      'templates',
      `${templateName}.html`,
    );

    const templateContent = await fs.promises.readFile(templatePath, 'utf8');
    const template = Handlebars.compile(templateContent);
    return template(variables);
  }

  async sendWelcomeEmail(to: string, name: string, link: string) {
    await this.sendMail({
      to,
      subject: 'Welcome to Rumor!',
      templateName: 'welcome',
      variables: { name, link },
    });
  }

  async sendVerifyEmailAddress(
    to: string,
    name: string,
    token: string,
    userId: string,
    email:string,
  ) {
    const verifyLink = `${this.baseUrl}/host/auth/set-password?mode=verifyEmailAddress&userToken=${token}&lang=en&type=verifyEmail&userId=${userId}&userEmail=${email}`;

    await this.sendMail({
      to,
      subject: 'Verify Your Email Address',
      templateName: 'verify-email',
      variables: { name, verifyLink },
    });
  }

  async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
    userId: string,
  ) {
    const resetPasswordLink = `${this.baseUrl}/host/auth/reset-password?mode=resetUserPassword&userToken=${token}&lang=en&type=resetPassword&userId=${userId}`;

    await this.sendMail({
      to,
      subject: 'Reset your password',
      templateName: 'reset-password-email',
      variables: { name, resetPasswordLink },
    });
  }
}
