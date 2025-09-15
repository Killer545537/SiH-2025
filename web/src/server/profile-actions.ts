'use server';

import { z } from 'zod';
import {
    bankDataSchema,
    bankSectionSchema,
    completeProfileSchema,
    contactDataSchema,
    contactSectionSchema,
    educationSchema,
    educationSectionSchema,
    emailVerificationSchema,
    personalDataSchema,
    personalSectionSchema,
    skillsDataSchema,
    skillsSectionSchema,
} from '@/lib/validations/profile'; // Save personal data section

// Save personal data section
export const savePersonalDataAction = async (data: z.infer<typeof personalDataSchema>) => {
    try {
        const validatedData = personalDataSchema.parse(data);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Saving personal data:', validatedData);

        return {
            success: true,
            message: 'Personal information saved successfully',
            data: validatedData,
        };
    } catch (error) {
        console.error('Save personal data error:', error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            };
        }
        return {
            success: false,
            message: 'Failed to save personal information',
        };
    }
};

// Send email verification OTP
export const sendEmailOTPAction = async (email: string) => {
    try {
        const validatedEmail = z.string().email().parse(email);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock OTP generation (in real app, this would send actual OTP)
        const mockOTP = '123456';

        console.log(`Mock: Sending OTP ${mockOTP} to ${validatedEmail}`);

        return {
            success: true,
            message: 'OTP sent successfully to your email',
            // In real implementation, don't return OTP in response
            mockOTP, // Only for demo purposes
        };
    } catch (error) {
        console.error('Send email OTP error:', error);
        return {
            success: false,
            message: 'Failed to send OTP. Please check your email address.',
        };
    }
};

// Verify email OTP
export const verifyEmailOTPAction = async (data: z.infer<typeof emailVerificationSchema>) => {
    try {
        const validatedData = emailVerificationSchema.parse(data);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock OTP verification (in real app, this would verify against stored OTP)
        const isValidOTP = validatedData.otp === '123456';

        if (isValidOTP) {
            console.log(`Email verified successfully: ${validatedData.email}`);
            return {
                success: true,
                message: 'Email verified successfully',
                email: validatedData.email,
            };
        } else {
            return {
                success: false,
                message: 'Invalid OTP. Please try again.',
            };
        }
    } catch (error) {
        console.error('Verify email OTP error:', error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Invalid OTP format',
                errors: error.errors,
            };
        }
        return {
            success: false,
            message: 'OTP verification failed',
        };
    }
};

// Save contact data section
export const saveContactDataAction = async (data: z.infer<typeof contactDataSchema>) => {
    try {
        const validatedData = contactDataSchema.parse(data);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Saving contact data:', validatedData);

        return {
            success: true,
            message: 'Contact information saved successfully',
            data: validatedData,
        };
    } catch (error) {
        console.error('Save contact data error:', error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            };
        }
        return {
            success: false,
            message: 'Failed to save contact information',
        };
    }
};

// Save education data
export const saveEducationDataAction = async (educations: z.infer<typeof educationSchema>[]) => {
    try {
        const validatedData = z.array(educationSchema).parse(educations);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        console.log('Saving education data:', validatedData);

        return {
            success: true,
            message: `${validatedData.length} education qualification(s) saved successfully`,
            data: validatedData,
        };
    } catch (error) {
        console.error('Save education data error:', error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            };
        }
        return {
            success: false,
            message: 'Failed to save education information',
        };
    }
};

// Validate IFSC code (mock validation)
export const validateIFSCAction = async (ifscCode: string) => {
    try {
        const validatedIFSC = z
            .string()
            .length(11, 'IFSC code must be 11 characters')
            .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format')
            .parse(ifscCode.toUpperCase());

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock bank details (in real app, this would fetch from bank API)
        const mockBankDetails = {
            bankName: 'State Bank of India',
            branch: 'New Delhi Main Branch',
            address: 'Connaught Place, New Delhi - 110001',
        };

        console.log(`IFSC validated: ${validatedIFSC}`, mockBankDetails);

        return {
            success: true,
            message: 'IFSC code is valid',
            ifscCode: validatedIFSC,
            bankDetails: mockBankDetails,
        };
    } catch (error) {
        console.error('IFSC validation error:', error);
        return {
            success: false,
            message: 'Invalid IFSC code format',
        };
    }
};

// Save bank data section
export const saveBankDataAction = async (data: z.infer<typeof bankDataSchema>) => {
    try {
        const validatedData = bankDataSchema.parse(data);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Saving bank data:', validatedData);

        return {
            success: true,
            message: 'Bank information saved successfully',
            data: validatedData,
        };
    } catch (error) {
        console.error('Save bank data error:', error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            };
        }
        return {
            success: false,
            message: 'Failed to save bank information',
        };
    }
};

// Save skills data section
export const saveSkillsDataAction = async (data: z.infer<typeof skillsDataSchema>) => {
    try {
        const validatedData = skillsDataSchema.parse(data);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Saving skills data:', validatedData);

        return {
            success: true,
            message: `Skills and languages saved successfully (${validatedData.skills.length} skills, ${validatedData.languages.length} languages)`,
            data: validatedData,
        };
    } catch (error) {
        console.error('Save skills data error:', error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            };
        }
        return {
            success: false,
            message: 'Failed to save skills information',
        };
    }
};

// Upload file action (mock implementation)
export const uploadFileAction = async (formData: FormData) => {
    try {
        const file = formData.get('file') as File;

        if (!file) {
            return {
                success: false,
                message: 'No file provided',
            };
        }

        // Validate file size (2MB limit)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            return {
                success: false,
                message: 'File size must be less than 2MB',
            };
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            return {
                success: false,
                message: 'File must be PDF, JPG, JPEG, or PNG',
            };
        }

        // Simulate file upload
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock file URL (in real app, this would be actual uploaded file URL)
        const mockFileUrl = `https://storage.example.com/certificates/${Date.now()}_${file.name}`;

        console.log(`File uploaded: ${file.name} -> ${mockFileUrl}`);

        return {
            success: true,
            message: 'File uploaded successfully',
            fileName: file.name,
            fileUrl: mockFileUrl,
            fileSize: file.size,
        };
    } catch (error) {
        console.error('File upload error:', error);
        return {
            success: false,
            message: 'File upload failed',
        };
    }
};

// Save complete profile (final submission)
export const saveCompleteProfileAction = async (data: z.infer<typeof completeProfileSchema>) => {
    try {
        const validatedData = completeProfileSchema.parse(data);

        // Simulate comprehensive save operation
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Mock profile ID generation
        const profileId = 'profile_' + Date.now();

        console.log('Complete profile saved:', {
            profileId,
            personalData: validatedData.personalData,
            contactData: validatedData.contactData,
            educationCount: validatedData.educations.length,
            bankData: validatedData.bankData,
            skillsCount: validatedData.skillsData.skills.length,
            languagesCount: validatedData.skillsData.languages.length,
        });

        return {
            success: true,
            message: 'Profile completed successfully! You can now apply for internships.',
            profileId,
            completionDate: new Date().toISOString(),
            summary: {
                sectionsCompleted: 5,
                totalSections: 5,
                completionPercentage: 100,
            },
        };
    } catch (error) {
        console.error('Save complete profile error:', error);
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Profile validation failed',
                errors: error.errors,
            };
        }
        return {
            success: false,
            message: 'Failed to save complete profile',
        };
    }
};

// Validate individual sections for progress tracking
export const validateSectionAction = async (sectionName: string, data: any) => {
    try {
        let schema;
        let validatedData;

        switch (sectionName) {
            case 'personal':
                schema = personalSectionSchema;
                break;
            case 'contact':
                schema = contactSectionSchema;
                break;
            case 'education':
                schema = educationSectionSchema;
                break;
            case 'bank':
                schema = bankSectionSchema;
                break;
            case 'skills':
                schema = skillsSectionSchema;
                break;
            default:
                return {
                    success: false,
                    message: 'Invalid section name',
                };
        }

        validatedData = schema.parse(data);

        return {
            success: true,
            message: `${sectionName} section is valid`,
            data: validatedData,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: `${sectionName} section validation failed`,
                errors: error.errors,
            };
        }
        return {
            success: false,
            message: 'Section validation failed',
        };
    }
};

// Get profile completion status
export const getProfileStatusAction = async (profileData: any) => {
    try {
        const sections = [
            { name: 'personal', schema: personalSectionSchema, data: profileData.personalData },
            { name: 'contact', schema: contactSectionSchema, data: profileData.contactData },
            { name: 'education', schema: educationSectionSchema, data: { educations: profileData.educations || [] } },
            { name: 'bank', schema: bankSectionSchema, data: profileData.bankData },
            { name: 'skills', schema: skillsSectionSchema, data: profileData.skillsData },
        ];

        const sectionStatus = sections.map((section) => {
            try {
                section.schema.parse(section.data);
                return { name: section.name, completed: true, errors: [] };
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return {
                        name: section.name,
                        completed: false,
                        errors: error.errors.map((e) => e.message),
                    };
                }
                return { name: section.name, completed: false, errors: ['Validation error'] };
            }
        });

        const completedSections = sectionStatus.filter((s) => s.completed).length;
        const totalSections = sections.length;
        const completionPercentage = Math.round((completedSections / totalSections) * 100);

        return {
            success: true,
            completionPercentage,
            completedSections,
            totalSections,
            sectionStatus,
        };
    } catch (error) {
        console.error('Get profile status error:', error);
        return {
            success: false,
            message: 'Failed to get profile status',
        };
    }
};
