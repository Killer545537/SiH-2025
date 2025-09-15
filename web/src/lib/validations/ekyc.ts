import { z } from 'zod';

// Aadhaar validation schema
export const aadhaarSchema = z.object({
    aadhaarNumber: z
        .string()
        .min(1, 'Aadhaar number is required')
        .regex(/^\d{4}\s\d{4}\s\d{4}$/, 'Enter a valid 12-digit Aadhaar number'),
    captcha: z.string().min(1, 'CAPTCHA is required').length(5, 'CAPTCHA must be 5 characters'),
    consent: z.boolean().refine((val) => val === true, 'You must provide consent to proceed'),
});

// OTP validation schema
export const otpSchema = z.object({
    otp: z
        .string()
        .min(1, 'OTP is required')
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

// Complete eKYC data schema
export const ekycDataSchema = z.object({
    method: z.enum(['aadhaar', 'digilocker']),
    aadhaarNumber: z.string().optional(),
    verificationStatus: z.enum(['pending', 'verified', 'failed']),
    verifiedAt: z.date().optional(),
    verificationData: z
        .object({
            name: z.string().optional(),
            dob: z.string().optional(),
            address: z.string().optional(),
        })
        .optional(),
});

export type AadhaarFormData = z.infer<typeof aadhaarSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type EKYCData = z.infer<typeof ekycDataSchema>;
