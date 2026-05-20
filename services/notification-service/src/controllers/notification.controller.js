const { sendSMS } = require('../providers/sms.provider');
const { sendEmail } = require('../providers/email.provider');

const sendDonorNotification = async (req, res, next) => {
    try {
        const delivery = await sendSMS({ phone: req.body.phone, message: req.body.message });
        res.status(202).json({ message: 'Donor notification queued', donorId: req.body.donorId, delivery });
    } catch (error) {
        next(error);
    }
};

const sendHospitalNotification = async (req, res, next) => {
    try {
        const delivery = await sendEmail({
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        });
        res.status(202).json({ message: 'Hospital notification queued', hospitalId: req.body.hospitalId, delivery });
    } catch (error) {
        next(error);
    }
};

module.exports = { sendDonorNotification, sendHospitalNotification };
