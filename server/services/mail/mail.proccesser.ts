import { Mail } from './mail.interface';
import { Job } from 'bullmq';
import { SES } from 'aws-sdk';

import nodemailer from 'nodemailer';
import config from './config';

let transporter: any;

if (config.smtp.host) {
  transporter = nodemailer.createTransport(
    config.smtp,
  );
} else {
  transporter = nodemailer.createTransport({
    SES: new SES({
      apiVersion: '2010-12-01',
      region: config.region,
    }),
  });
}

export default (job: Job<Mail>) =>
  transporter.sendMail(job.data);
