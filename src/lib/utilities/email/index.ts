// packages
import mail from '@sendgrid/mail';

// lib
import metadata from '$lib/metadata';

// env
import { SENDGRID_KEY } from '$env/static/private';

mail.setApiKey(SENDGRID_KEY);

const supportEmail = metadata.supportEmail;
const personalEmail = metadata.personalEmail;

export const sendEmail = async (message: {
	fromEmail?: string;
	replyToEmail?: string;
	templateId: string;
	toEmail: string;
}) => {
	await mail.send({
		templateId: message.templateId,
		from: {
			email: message.fromEmail ?? personalEmail,
			name: 'Sam from Transform Writings'
		},
		to: message.toEmail,
		replyTo: message.replyToEmail ?? supportEmail
	});

	console.log('📨 Email sent...');
};

export const sendHtmlEmail = async (message: {
	subject: string;
	html: string;
	toEmail: string;
}) => {
	await mail.send({
		from: {
			email: metadata.noReplyEmail,
			name: 'Transform Writings'
		},
		subject: message.subject,
		html: message.html,
		to: message.toEmail
	});

	console.log('📨 Email sent...');
};
