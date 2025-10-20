export interface SendMailOptions {
  to: string;
  subject: string;
  templateName: string; // e.g. 'welcome' or 'reset-password'
  variables: Record<string, any>;
}
