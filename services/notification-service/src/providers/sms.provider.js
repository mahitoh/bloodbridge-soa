const sendSMS = async ({ phone, message }) => ({
    provider: 'stub-sms',
    to: phone,
    message,
    status: 'queued',
    providerMessageId: `sms_${Date.now()}`
});

module.exports = { sendSMS };
