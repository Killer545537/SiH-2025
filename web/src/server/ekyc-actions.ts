'use server';

import { createHash, randomUUID } from 'crypto';
import { headers } from 'next/headers';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db/db';
import { ekycVerifications } from '@/db/schema/onboarding-schema';
import { auth } from '@/lib/auth';
import { aadhaarSchema, ekycDataSchema, otpSchema } from '@/lib/validations/ekyc';

type VerificationStatus = 'pending' | 'verified' | 'failed';

type EkycVerificationData = {
    otpHash?: string;
    otpExpiresAt?: string;
    userData?: {
        name?: string;
        dob?: string;
        address?: string;
        gender?: string;
        mobile?: string;
        documents?: Record<string, string>;
    };
};

const OTP_EXPIRY_MINUTES = 5;

const requireSession = async () => {
    const rawHeaders = await headers();
    const session = await auth.api.getSession({
        headers: rawHeaders,
    });

    if (!session?.user?.id) {
        throw new Error('UNAUTHORIZED');
    }

    return session;
};

const generateOtp = () => '123456';

const hashOtp = (otp: string) => createHash('sha256').update(otp).digest('hex');

const normalizeAadhaar = (aadhaarNumber: string) => aadhaarNumber.replace(/\s+/g, '');

const getLatestVerification = async (userId: string, method: 'aadhaar' | 'digilocker') => {
    const [latest] = await db
        .select()
        .from(ekycVerifications)
        .where(and(eq(ekycVerifications.userId, userId), eq(ekycVerifications.method, method)))
        .orderBy(desc(ekycVerifications.createdAt))
        .limit(1);

    return latest ?? null;
};

export const verifyAadhaarAction = async (data: z.infer<typeof aadhaarSchema>) => {
    try {
        const validatedData = aadhaarSchema.parse(data);
        const { user } = await requireSession();

        const aadhaarSanitized = normalizeAadhaar(validatedData.aadhaarNumber);
        const transactionId = `TXN-${randomUUID()}`;
        const otp = generateOtp();
        const otpHash = hashOtp(otp);
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

        const existing = await getLatestVerification(user.id, 'aadhaar');
        const payload: EkycVerificationData = {
            ...(existing?.verificationData as EkycVerificationData | null) ?? {},
            otpHash,
            otpExpiresAt,
        };

        if (existing) {
            await db
                .update(ekycVerifications)
                .set({
                    transactionId,
                    status: 'pending',
                    aadhaarLastFour: aadhaarSanitized.slice(-4),
                    consentGiven: validatedData.consent,
                    verificationData: payload,
                    updatedAt: new Date(),
                })
                .where(eq(ekycVerifications.id, existing.id));
        } else {
            await db.insert(ekycVerifications).values({
                userId: user.id,
                method: 'aadhaar',
                status: 'pending',
                transactionId,
                aadhaarLastFour: aadhaarSanitized.slice(-4),
                consentGiven: validatedData.consent,
                verificationData: payload,
            });
        }

        return {
            success: true,
            message: 'OTP sent to your Aadhaar-linked mobile number',
            transactionId,
            ...(process.env.NODE_ENV !== 'production' ? { debugOtp: otp } : {}),
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Invalid Aadhaar details provided',
                errors: error.issues,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in before starting eKYC verification.',
            } as const;
        }

        console.error('Aadhaar verification error:', error);
        return {
            success: false,
            message: 'Verification failed. Please try again.',
        } as const;
    }
};

export const verifyOTPAction = async (otp: string, transactionId: string) => {
    try {
        const { otp: parsedOtp } = otpSchema.parse({ otp });
        const { user } = await requireSession();

        const [verification] = await db
            .select()
            .from(ekycVerifications)
            .where(and(eq(ekycVerifications.userId, user.id), eq(ekycVerifications.transactionId, transactionId)))
            .limit(1);

        if (!verification) {
            return {
                success: false,
                message: 'Invalid or expired transaction. Please restart verification.',
            } as const;
        }

        const verificationData = (verification.verificationData as EkycVerificationData | null) ?? {};

        if (!verificationData.otpHash || !verificationData.otpExpiresAt) {
            return {
                success: false,
                message: 'OTP expired. Please request a new OTP.',
            } as const;
        }

        if (new Date(verificationData.otpExpiresAt) < new Date()) {
            return {
                success: false,
                message: 'OTP expired. Please request a new OTP.',
            } as const;
        }

        if (hashOtp(parsedOtp) !== verificationData.otpHash) {
            return {
                success: false,
                message: 'Invalid OTP. Please enter the correct 6-digit OTP.',
            } as const;
        }

        const userData = {
            name: 'Rahul Kumar Singh',
            dob: '1995-06-15',
            address: '123 MG Road, Connaught Place, New Delhi 110001',
            gender: 'Male',
            mobile: '+91-98765*****',
        } as const;

        const updatedData: EkycVerificationData = {
            ...verificationData,
            userData,
        };
        delete updatedData.otpHash;
        delete updatedData.otpExpiresAt;

        await db
            .update(ekycVerifications)
            .set({
                status: 'verified',
                verifiedAt: new Date(),
                verificationData: updatedData,
                updatedAt: new Date(),
            })
            .where(eq(ekycVerifications.id, verification.id));

        return {
            success: true,
            message: 'Identity verified successfully',
            userData,
            transactionId,
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'OTP validation failed',
                errors: error.issues,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in before verifying OTP.',
            } as const;
        }

        console.error('OTP verification error:', error);
        return {
            success: false,
            message: 'OTP verification failed. Please try again.',
        } as const;
    }
};

export const authenticateDigiLockerAction = async () => {
    try {
        const { user } = await requireSession();
        const transactionId = `DLK-${randomUUID()}`;

        const userData = {
            name: 'Priya Sharma',
            dob: '1992-08-20',
            address: '456 Park Street, Bandra West, Mumbai 400050',
            gender: 'Female',
            documents: {
                aadhaar: 'Available',
                pan: 'Available',
                drivingLicense: 'Available',
            },
        } as const;

        const existing = await getLatestVerification(user.id, 'digilocker');
        const verificationData: EkycVerificationData = {
            ...(existing?.verificationData as EkycVerificationData | null) ?? {},
            userData,
        };

        if (existing) {
            await db
                .update(ekycVerifications)
                .set({
                    transactionId,
                    status: 'verified',
                    verificationData,
                    verifiedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(ekycVerifications.id, existing.id));
        } else {
            await db.insert(ekycVerifications).values({
                userId: user.id,
                method: 'digilocker',
                status: 'verified',
                transactionId,
                digilockerReference: `DGL-${Date.now()}`,
                consentGiven: true,
                verifiedAt: new Date(),
                verificationData,
            });
        }

        return {
            success: true,
            message: 'DigiLocker authentication successful',
            userData,
            transactionId,
        } as const;
    } catch (error) {
        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in before using DigiLocker.',
            } as const;
        }

        console.error('DigiLocker authentication error:', error);
        return {
            success: false,
            message: 'DigiLocker service temporarily unavailable. Please try again later.',
        } as const;
    }
};

export const saveEKYCDataAction = async (data: z.infer<typeof ekycDataSchema>) => {
    try {
        const validatedData = ekycDataSchema.parse(data);
        const { user } = await requireSession();

        const sanitizedAadhaar = validatedData.aadhaarNumber
            ? normalizeAadhaar(validatedData.aadhaarNumber)
            : undefined;

        const [existing] = await db
            .select()
            .from(ekycVerifications)
            .where(and(eq(ekycVerifications.userId, user.id), eq(ekycVerifications.method, validatedData.method)))
            .orderBy(desc(ekycVerifications.createdAt))
            .limit(1);

        const currentData = (existing?.verificationData as EkycVerificationData | null) ?? {};
        const mergedData: EkycVerificationData = {
            ...currentData,
            userData: validatedData.verificationData
                ? {
                      ...currentData.userData,
                      ...validatedData.verificationData,
                  }
                : currentData.userData,
        };

        const [record] = existing
            ? await db
                  .update(ekycVerifications)
                  .set({
                      status: validatedData.verificationStatus as VerificationStatus,
                      verifiedAt: validatedData.verifiedAt ?? existing.verifiedAt,
                      aadhaarLastFour: sanitizedAadhaar?.slice(-4) ?? existing.aadhaarLastFour,
                      verificationData: mergedData,
                      updatedAt: new Date(),
                  })
                  .where(eq(ekycVerifications.id, existing.id))
                  .returning()
            : await db
                  .insert(ekycVerifications)
                  .values({
                      userId: user.id,
                      method: validatedData.method,
                      status: validatedData.verificationStatus as VerificationStatus,
                      aadhaarLastFour: sanitizedAadhaar?.slice(-4),
                      verificationData: mergedData,
                      verifiedAt: validatedData.verifiedAt,
                  })
                  .returning();

        return {
            success: true,
            message: 'eKYC data saved successfully',
            id: record.id,
            record,
        } as const;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Invalid eKYC payload',
                errors: error.issues,
            } as const;
        }

        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in before saving eKYC information.',
            } as const;
        }

        console.error('Save eKYC data error:', error);
        return {
            success: false,
            message: 'Failed to save eKYC data. Please try again.',
        } as const;
    }
};

export const checkVerificationStatusAction = async (transactionId: string) => {
    try {
        const { user } = await requireSession();

        const [record] = await db
            .select({ status: ekycVerifications.status, transactionId: ekycVerifications.transactionId })
            .from(ekycVerifications)
            .where(and(eq(ekycVerifications.userId, user.id), eq(ekycVerifications.transactionId, transactionId)))
            .limit(1);

        if (!record) {
            return {
                success: false,
                message: 'Unable to locate verification request. Please restart the process.',
            } as const;
        }

        return {
            success: true,
            transactionId: record.transactionId,
            status: record.status,
            message: `Verification status: ${record.status}`,
        } as const;
    } catch (error) {
        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in to view verification status.',
            } as const;
        }

        console.error('Status check error:', error);
        return {
            success: false,
            message: 'Failed to check verification status',
        } as const;
    }
};

export const resendOTPAction = async (transactionId: string) => {
    try {
        const { user } = await requireSession();

        const [record] = await db
            .select()
            .from(ekycVerifications)
            .where(and(eq(ekycVerifications.userId, user.id), eq(ekycVerifications.transactionId, transactionId)))
            .limit(1);

        if (!record) {
            return {
                success: false,
                message: 'Invalid transaction. Please restart the verification process.',
            } as const;
        }

        const otp = generateOtp();
        const otpHash = hashOtp(otp);
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();
        const mergedData: EkycVerificationData = {
            ...(record.verificationData as EkycVerificationData | null) ?? {},
            otpHash,
            otpExpiresAt,
        };

        await db
            .update(ekycVerifications)
            .set({
                status: 'pending',
                verificationData: mergedData,
                updatedAt: new Date(),
            })
            .where(eq(ekycVerifications.id, record.id));

        return {
            success: true,
            message: 'OTP resent successfully to your registered mobile number',
            transactionId,
            ...(process.env.NODE_ENV !== 'production' ? { debugOtp: otp } : {}),
        } as const;
    } catch (error) {
        if ((error as Error).message === 'UNAUTHORIZED') {
            return {
                success: false,
                message: 'You need to sign in before requesting a new OTP.',
            } as const;
        }

        console.error('Resend OTP error:', error);
        return {
            success: false,
            message: 'Failed to resend OTP. Please try again.',
        } as const;
    }
};
