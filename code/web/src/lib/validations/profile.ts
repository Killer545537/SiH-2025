import { z } from 'zod';

// Personal data schema
export const personalDataSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    dob: z.string().min(1, 'Date of birth is required'),
    gender: z.string().min(1, 'Gender is required'),
    fatherName: z.string().min(1, "Father's/Guardian's name is required"),
    category: z.enum(['general', 'obc', 'sc', 'st'], {
        required_error: 'Category is required',
    }),
    permanentAddress: z.object({
        line1: z.string().min(1, 'Address line 1 is required'),
        line2: z.string().optional(),
        state: z.string().min(1, 'State is required'),
        district: z.string().min(1, 'District is required'),
        block: z.string().min(1, 'Block is required'),
        village: z.string().min(1, 'Village/City is required'),
        pin: z
            .string()
            .length(6, 'PIN code must be 6 digits')
            .regex(/^\d{6}$/, 'PIN code must contain only numbers'),
    }),
    currentAddress: z.object({
        sameAsPermanent: z.boolean(),
        line1: z.string().optional(),
        line2: z.string().optional(),
        state: z.string().optional(),
        district: z.string().optional(),
        block: z.string().optional(),
        village: z.string().optional(),
        pin: z.string().optional(),
    }),
    disability: z.object({
        hasDisability: z.boolean(),
        type: z.string().optional(),
    }),
});

// Contact data schema
export const contactDataSchema = z.object({
    primaryMobile: z.string().min(1, 'Primary mobile is required'),
    alternateMobile: z
        .string()
        .optional()
        .refine((val) => !val || /^\d{10}$/.test(val), {
            message: 'Alternate mobile must be 10 digits',
        }),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    emailVerified: z.boolean(),
});

// Education schema
export const educationSchema = z.object({
    id: z.string(),
    level: z.enum(['10th', '12th', 'diploma', 'graduation', 'postgraduation'], {
        required_error: 'Course level is required',
    }),
    subject: z.string().optional(),
    board: z.string().min(1, 'Board/University is required'),
    institute: z.string().min(1, 'Institute name is required'),
    year: z
        .string()
        .min(1, 'Year of passing is required')
        .regex(/^\d{4}$/, 'Year must be 4 digits')
        .refine((val) => {
            const year = parseInt(val);
            const currentYear = new Date().getFullYear();
            return year >= 1950 && year <= currentYear + 1;
        }, 'Invalid year'),
    marksType: z.enum(['percentage', 'cgpa', 'grade'], {
        required_error: 'Marks type is required',
    }),
    marksValue: z.string().min(1, 'Marks value is required'),
});

// Bank data schema
export const bankDataSchema = z.object({
    isAadhaarSeeded: z.boolean(),
    accountNumber: z
        .string()
        .min(1, 'Account number is required')
        .min(9, 'Account number must be at least 9 digits')
        .max(18, 'Account number cannot exceed 18 digits')
        .regex(/^\d+$/, 'Account number must contain only numbers'),
    ifsc: z
        .string()
        .min(1, 'IFSC code is required')
        .length(11, 'IFSC code must be 11 characters')
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
    bankName: z.string().min(1, 'Bank name is required'),
    branch: z.string().min(1, 'Branch name is required'),
});

// Language schema
export const languageSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Language name is required'),
    proficiency: z.enum(['basic', 'intermediate', 'advanced', 'native'], {
        required_error: 'Proficiency level is required',
    }),
});

// Skills data schema
export const skillsDataSchema = z.object({
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
    languages: z.array(languageSchema).min(1, 'At least one language is required'),
});

// Complete profile schema
export const completeProfileSchema = z.object({
    personalData: personalDataSchema,
    contactData: contactDataSchema,
    educations: z.array(educationSchema).min(1, 'At least one education qualification is required'),
    bankData: bankDataSchema,
    skillsData: skillsDataSchema,
});

// Individual section validation schemas for step-by-step validation
export const personalSectionSchema = personalDataSchema.pick({
    fatherName: true,
    category: true,
});

export const contactSectionSchema = contactDataSchema.pick({
    email: true,
    emailVerified: true,
});

export const educationSectionSchema = z.object({
    educations: z.array(educationSchema).min(1, 'At least one education qualification is required'),
});

export const bankSectionSchema = bankDataSchema;

export const skillsSectionSchema = skillsDataSchema;

// Type exports
export type PersonalData = z.infer<typeof personalDataSchema>;
export type ContactData = z.infer<typeof contactDataSchema>;
export type Education = z.infer<typeof educationSchema>;
export type BankData = z.infer<typeof bankDataSchema>;
export type Language = z.infer<typeof languageSchema>;
export type SkillsData = z.infer<typeof skillsDataSchema>;
export type CompleteProfile = z.infer<typeof completeProfileSchema>;

// Email verification schema
export const emailVerificationSchema = z.object({
    email: z.string().email('Invalid email format'),
    otp: z
        .string()
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

export type EmailVerification = z.infer<typeof emailVerificationSchema>;
