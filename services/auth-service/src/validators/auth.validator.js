const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['DONOR', 'HOSPITAL', 'ADMIN']).default('DONOR'),
    bloodType: z.string().optional(),
    phone: z.string().optional(),
    city: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

const verifySchema = z.object({
    token: z.string().min(1)
});

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors });
    }
    req.body = result.data;
    next();
};

module.exports = {
    registerSchema,
    loginSchema,
    verifySchema,
    validateRegister: validate(registerSchema),
    validateLogin: validate(loginSchema),
    validateVerify: validate(verifySchema)
};
