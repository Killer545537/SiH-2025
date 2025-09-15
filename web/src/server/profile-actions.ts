'use server';

import { createHash, randomUUID } from 'crypto';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db/db';
import {
    profileBankDetails,
    profileEducations,
    profileLanguages,
    profileSkills,
    profiles,
    verification,
} from '@/db/schema';
import { auth } from '@/lib/auth';
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
} from '@/lib/validations/profile';

import type {
    BankData,
    ContactData,
    Education,
    PersonalData,
    SkillsData,
} from '@/lib/validations/profile';

type ProfileStatusInput = {
    personalData: PersonalData;
    contactData: ContactData;
    educations: Array<Education>;
    bankData: BankData;
    skillsData: SkillsData;
};

const EMAIL_OTP_EXPIRY_MINUTES = 10;

const requireSession = async () => {
    const session = await auth.api.getSession({
        headers: Object.fromEntries(headers().entries()),
    });

    if (!session?.user?.id) {
        throw new Error('UNAUTHORIZED');
    }

    return session;
};

const ensureProfile = async (userId: string) => {
    const [existing] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

    if (existing) {
        return existing;
    }

    const [created] = await db.insert(profiles).values({ userId }).returning();
    return created;
};

const parseDateString = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const parts = trimmed.split(/[/-]/);
    if (parts.length === 3) {
        const [first, second, third] = parts;
        if (first.length === 4) {
            const iso = new Date(`${first}-${second}-${third}`);
            if (!Number.isNaN(iso.getTime())) {
                return iso;
            }
        } else {
            const day = Number.parseInt(first, 10);
            const month = Number.parseInt(second, 10);
            const year = Number.parseInt(third, 10);
            if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                const parsed = new Date(year, month - 1, day);
                if (!Number.isNaN(parsed.getTime())) {
                    return parsed;
                }
            }
        }
    }

    const fallback = new Date(trimmed);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const generateNumericOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashOtp = (otp: string) => createHash('sha256').update(otp).digest('hex');

const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const savePersonalDataAction = async (data: PersonalData) => {
    try {
        const validatedData = personalDataSchema.parse(data);
        const { user } = await requireSession();
        await ensureProfile(user.id);

        const permanent = validatedData.permanentAddress;
        const current = validatedData.currentAddress.sameAsPermanent
            ? {
                  line1: permanent.line1,
                  line2: permanent.line2,
                  state: permanent.state,
                  district: permanent.district,
                  block: permanent.block,
                  village: permanent.village,
                  pin: permanent.pin,
              }
            : validatedData.currentAddress;

        const dobDate = parseDateString(validatedData.dob);

        await db
            .update(profiles)
            .set({
                name: validatedData.name,
                dob: dobDate ?? null,
                gender: validatedData.gender,
                fatherName: validatedData.fatherName,
                category: validatedData.category,
                hasDisability: validatedData.disability.hasDisability,
                disabilityType: validatedData.disability.type ?? null,
                permanentAddressLine1: permanent.line1,
                permanentAddressLine2: permanent.line2 ?? null,
                permanentState: permanent.state,
                permanentDistrict: permanent.district,
                permanentBlock: permanent.block,
                permanentVillage: permanent.village,
                permanentPin: permanent.pin,
                currentAddressSameAsPermanent: validatedData.currentAddress.sameAsPermanent,
                currentAddressLine1: current.line1 ?? null,
                currentAddressLine2: current.line2 ?? null,
                currentState: current.state ?? null,
                currentDistrict: current.district ?? null,
                currentBlock: current.block ?? null,
                currentVillage: current.village ?? null,
                currentPin: current.pin ?? null,
                updatedAt: new Date(),
            })
            .where(eq(profiles.userId, user.id));

        return {
            success: true,
            message: 'Personal information saved successfully',
            data: validatedData,
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in to update your profile.',
            } as const;
        }

        console.error('Save personal data error:', error);
        return {
            success: false,
            message: 'Failed to save personal information',
        } as const;
    }
};

export const sendEmailOTPAction = async (email: string) => {
    try {
        const validatedEmail = z.string().email().parse(email.trim());
        const normalized = normalizeEmail(validatedEmail);
        const { user } = await requireSession();
        await ensureProfile(user.id);

        const identifier = `profile-email-otp:${user.id}:${normalized}`;
        const otp = generateNumericOtp();
        const hashedOtp = hashOtp(otp);
        const expiresAt = new Date(Date.now() + EMAIL_OTP_EXPIRY_MINUTES * 60 * 1000);

        const [existing] = await db
            .select()
            .from(verification)
            .where(eq(verification.identifier, identifier))
            .limit(1);

        if (existing) {
            await db
                .update(verification)
                .set({
                    value: hashedOtp,
                    expiresAt,
                    updatedAt: new Date(),
                })
                .where(eq(verification.identifier, identifier));
        } else {
            await db.insert(verification).values({
                id: randomUUID(),
                identifier,
                value: hashedOtp,
                expiresAt,
            });
        }

        await db
            .update(profiles)
            .set({
                email: normalized,
                isEmailVerified: false,
                emailVerifiedAt: null,
                updatedAt: new Date(),
            })
            .where(eq(profiles.userId, user.id));

        return {
            success: true,
            message: 'OTP sent successfully to your email',
            mockOTP: otp,
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Failed to send OTP. Please check your email address.',
                errors: error.errors,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in to request an email OTP.',
            } as const;
        }

        console.error('Send email OTP error:', error);
        return {
            success: false,
            message: 'Failed to send OTP. Please check your email address.',
        } as const;
    }
};

export const verifyEmailOTPAction = async (data: z.infer<typeof emailVerificationSchema>) => {
    try {
        const validatedData = emailVerificationSchema.parse(data);
        const normalizedEmail = normalizeEmail(validatedData.email);
        const { user } = await requireSession();
        await ensureProfile(user.id);

        const identifier = `profile-email-otp:${user.id}:${normalizedEmail}`;

        const [record] = await db
            .select()
            .from(verification)
            .where(eq(verification.identifier, identifier))
            .limit(1);

        if (!record) {
            return {
                success: false,
                message: 'OTP expired or not requested. Please resend OTP.',
            } as const;
        }

        if (record.expiresAt < new Date()) {
            await db.delete(verification).where(eq(verification.id, record.id));
            return {
                success: false,
                message: 'OTP expired. Please request a new OTP.',
            } as const;
        }

        if (hashOtp(validatedData.otp) !== record.value) {
            return {
                success: false,
                message: 'Invalid OTP. Please try again.',
            } as const;
        }

        await db.transaction(async (tx) => {
            await tx
                .update(profiles)
                .set({
                    email: normalizedEmail,
                    isEmailVerified: true,
                    emailVerifiedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(profiles.userId, user.id));

            await tx.delete(verification).where(eq(verification.id, record.id));
        });

        return {
            success: true,
            message: 'Email verified successfully',
            email: normalizedEmail,
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Invalid OTP format',
                errors: error.errors,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in before verifying the OTP.',
            } as const;
        }

        console.error('Verify email OTP error:', error);
        return {
            success: false,
            message: 'OTP verification failed',
        } as const;
    }
};

export const saveContactDataAction = async (data: ContactData) => {
    try {
        const validatedData = contactDataSchema.parse(data);
        const { user } = await requireSession();
        const profile = await ensureProfile(user.id);
        const normalizedEmail = normalizeEmail(validatedData.email);

        const verifiedAt = validatedData.emailVerified
            ? profile.email === normalizedEmail && profile.emailVerifiedAt
                ? profile.emailVerifiedAt
                : new Date()
            : null;

        await db
            .update(profiles)
            .set({
                primaryMobile: validatedData.primaryMobile,
                alternateMobile: validatedData.alternateMobile || null,
                email: normalizedEmail,
                isEmailVerified: validatedData.emailVerified,
                emailVerifiedAt: verifiedAt,
                updatedAt: new Date(),
            })
            .where(eq(profiles.userId, user.id));

        return {
            success: true,
            message: 'Contact information saved successfully',
            data: validatedData,
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in to update your contact details.',
            } as const;
        }

        console.error('Save contact data error:', error);
        return {
            success: false,
            message: 'Failed to save contact information',
        } as const;
    }
};

export const saveEducationDataAction = async (educations: Education[]) => {
    try {
        const validatedData = z.array(educationSchema).parse(educations);
        const { user } = await requireSession();
        await ensureProfile(user.id);

        await db.transaction(async (tx) => {
            await tx.delete(profileEducations).where(eq(profileEducations.profileId, user.id));

            if (validatedData.length > 0) {
                await tx.insert(profileEducations).values(
                    validatedData.map((education) => ({
                        profileId: user.id,
                        level: education.level,
                        subject: education.subject ?? null,
                        board: education.board,
                        institute: education.institute,
                        yearOfPassing: Number.parseInt(education.year, 10),
                        marksType: education.marksType,
                        marksValue: education.marksValue,
                    }))
                );
            }
        });

        return {
            success: true,
            message: `${validatedData.length} education qualification(s) saved successfully`,
            data: validatedData,
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in to update your education information.',
            } as const;
        }

        console.error('Save education data error:', error);
        return {
            success: false,
            message: 'Failed to save education information',
        } as const;
    }
};

export const validateIFSCAction = async (ifscCode: string) => {
    try {
        const validatedIFSC = z
            .string()
            .length(11, 'IFSC code must be 11 characters')
            .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format')
            .parse(ifscCode.toUpperCase());

        try {
            const response = await fetch(`https://ifsc.razorpay.com/${validatedIFSC}`, {
                cache: 'no-store',
            });

            if (response.ok) {
                const bankInfo = (await response.json()) as {
                    BANK?: string;
                    BRANCH?: string;
                    ADDRESS?: string;
                };

                return {
                    success: true,
                    message: 'IFSC code is valid',
                    ifscCode: validatedIFSC,
                    bankDetails: {
                        bankName: bankInfo.BANK ?? '',
                        branch: bankInfo.BRANCH ?? '',
                        address: bankInfo.ADDRESS ?? '',
                    },
                } as const;
            }
        } catch (lookupError) {
            console.warn('IFSC lookup failed, falling back to format validation only:', lookupError);
        }

        return {
            success: true,
            message: 'IFSC code format looks valid',
            ifscCode: validatedIFSC,
        } as const;
    } catch (error) {
        console.error('IFSC validation error:', error);
        return {
            success: false,
            message: 'Invalid IFSC code format',
        } as const;
    }
};

export const saveBankDataAction = async (data: BankData) => {
    try {
        const validatedData = bankDataSchema.parse(data);
        const { user } = await requireSession();
        await ensureProfile(user.id);

        const [record] = await db
            .insert(profileBankDetails)
            .values({
                profileId: user.id,
                isAadhaarSeeded: validatedData.isAadhaarSeeded,
                accountNumber: validatedData.accountNumber,
                ifsc: validatedData.ifsc,
                bankName: validatedData.bankName,
                branch: validatedData.branch,
            })
            .onConflictDoUpdate({
                target: profileBankDetails.profileId,
                set: {
                    isAadhaarSeeded: validatedData.isAadhaarSeeded,
                    accountNumber: validatedData.accountNumber,
                    ifsc: validatedData.ifsc,
                    bankName: validatedData.bankName,
                    branch: validatedData.branch,
                    updatedAt: new Date(),
                },
            })
            .returning();

        return {
            success: true,
            message: 'Bank information saved successfully',
            data: validatedData,
            record,
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in to update your bank information.',
            } as const;
        }

        console.error('Save bank data error:', error);
        return {
            success: false,
            message: 'Failed to save bank information',
        } as const;
    }
};

export const saveSkillsDataAction = async (data: SkillsData) => {
    try {
        const validatedData = skillsDataSchema.parse(data);
        const { user } = await requireSession();
        await ensureProfile(user.id);

        await db.transaction(async (tx) => {
            await tx.delete(profileSkills).where(eq(profileSkills.profileId, user.id));
            if (validatedData.skills.length > 0) {
                await tx.insert(profileSkills).values(
                    validatedData.skills.map((skill) => ({
                        profileId: user.id,
                        skill,
                    }))
                );
            }

            await tx.delete(profileLanguages).where(eq(profileLanguages.profileId, user.id));
            if (validatedData.languages.length > 0) {
                await tx.insert(profileLanguages).values(
                    validatedData.languages.map((language) => ({
                        profileId: user.id,
                        name: language.name,
                        proficiency: language.proficiency,
                    }))
                );
            }
        });

        return {
            success: true,
            message: `Skills and languages saved successfully (${validatedData.skills.length} skills, ${validatedData.languages.length} languages)`,
            data: validatedData,
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in to update your skills.',
            } as const;
        }

        console.error('Save skills data error:', error);
        return {
            success: false,
            message: 'Failed to save skills information',
        } as const;
    }
};

export const uploadFileAction = async (formData: FormData) => {
    try {
        const file = formData.get('file') as File | null;

        if (!file) {
            return {
                success: false,
                message: 'No file provided',
            } as const;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return {
                success: false,
                message: 'File size must be less than 2MB',
            } as const;
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            return {
                success: false,
                message: 'File must be PDF, JPG, JPEG, or PNG',
            } as const;
        }

        // In a production system this would upload to object storage (S3, GCS, etc.).
        // We return a mock URL so the UI can display a successful state during development.
        const mockFileUrl = `https://storage.example.com/uploads/${Date.now()}_${encodeURIComponent(file.name)}`;

        return {
            success: true,
            message: 'File uploaded successfully',
            fileName: file.name,
            fileUrl: mockFileUrl,
            fileSize: file.size,
        } as const;
    } catch (error) {
        console.error('File upload error:', error);
        return {
            success: false,
            message: 'File upload failed',
        } as const;
    }
};

export const saveCompleteProfileAction = async (data: z.infer<typeof completeProfileSchema>) => {
    try {
        completeProfileSchema.parse(data);
        const { user } = await requireSession();
        await ensureProfile(user.id);

        await db
            .update(profiles)
            .set({
                isComplete: true,
                completedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(profiles.userId, user.id));

        return {
            success: true,
            message: 'Profile completed successfully! You can now apply for internships.',
            profileId: user.id,
            completionDate: new Date().toISOString(),
            summary: {
                sectionsCompleted: 5,
                totalSections: 5,
                completionPercentage: 100,
            },
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Profile validation failed',
                errors: error.errors,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in before submitting your profile.',
            } as const;
        }

        console.error('Save complete profile error:', error);
        return {
            success: false,
            message: 'Failed to save complete profile',
        } as const;
    }
};

export const validateSectionAction = async (sectionName: string, data: unknown) => {
    try {
        let schema: z.ZodTypeAny;

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
                } as const;
        }

        const validatedData = schema.parse(data);

        return {
            success: true,
            message: `${sectionName} section is valid`,
            data: validatedData,
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: `${sectionName} section validation failed`,
                errors: error.issues,
            } as const;
        }

        return {
            success: false,
            message: 'Section validation failed',
        } as const;
    }
};

export const getProfileStatusAction = async (profileData: ProfileStatusInput) => {
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
                return { name: section.name, completed: true, errors: [] as string[] };
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return {
                        name: section.name,
                        completed: false,
                        errors: error.issues.map((issue) => issue.message),
                    } as const;
                }

                return { name: section.name, completed: false, errors: ['Validation error'] } as const;
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
        } as const;
    } catch (error) {
        console.error('Get profile status error:', error);
        return {
            success: false,
            message: 'Failed to get profile status',
        } as const;
    }
};
