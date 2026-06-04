const { z } = require('zod');

const hospitalIdSchema = z.string().uuid({ message: 'Invalid hospital ID format' });

const bloodTypeSchema = z.enum(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'], {
    message: 'Invalid blood type. Must be one of: O+, O-, A+, A-, B+, B-, AB+, AB-'
});

const validateHospitalId = (req, res, next) => {
    const result = hospitalIdSchema.safeParse(req.params.hospitalId);
    if (!result.success) {
        return res.status(400).json({ error: 'Invalid hospital ID', details: result.error.flatten().fieldErrors });
    }
    next();
};

const validateBloodType = (req, res, next) => {
    const result = bloodTypeSchema.safeParse(req.params.bloodType);
    if (!result.success) {
        return res.status(400).json({ error: 'Invalid blood type', details: result.error.flatten().fieldErrors });
    }
    next();
};

const inventoryUpdateSchema = z.object({
    unitsAvailable: z.number().int().min(0, { message: 'Units available must be a non-negative integer' }),
    unitsReserved: z.number().int().min(0, { message: 'Units reserved must be a non-negative integer' })
});

const validateInventoryUpdate = (req, res, next) => {
    const result = inventoryUpdateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors });
    }
    req.body = result.data;
    next();
};

module.exports = {
    validateHospitalId,
    validateBloodType,
    validateInventoryUpdate
};
