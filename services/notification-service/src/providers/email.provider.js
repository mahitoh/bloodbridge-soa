const sendEmail = async ({ email, subject, message }) => ({
    provider: 'stub-email',
    to: email,
    subject,
    message,
    status: 'queued',
    providerMessageId: `email_${Date.now()}`
});

module.exports = { sendEmail };
