'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, CreditCard, FileText, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackToHomeButton } from '@/components/back-to-home-button';
import {
    authenticateDigiLockerAction,
    saveEKYCDataAction,
    verifyAadhaarAction,
    verifyOTPAction,
} from '@/server/ekyc-actions';
import type { AadhaarFormData, OTPFormData } from '@/lib/validations/ekyc';
import { aadhaarSchema, otpSchema } from '@/lib/validations/ekyc';

type VerificationStep = 'select' | 'verify' | 'otp' | 'complete';
type VerificationMethod = 'aadhaar' | 'digilocker';

const EKYCPage = () => {
    const router = useRouter();
    const [step, setStep] = useState<VerificationStep>('select');
    const [selectedMethod, setSelectedMethod] = useState<VerificationMethod>('aadhaar');
    const [isLoading, setIsLoading] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [otpTimer, setOtpTimer] = useState(0);

    // Form data
    const [formData, setFormData] = useState({
        aadhaarNumber: '',
        captcha: '',
        consent: false,
        otp: '',
    });

    // Form errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // OTP timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    // Auto-redirect after successful verification
    useEffect(() => {
        if (step === 'complete') {
            const timer = setTimeout(() => {
                router.push('/profile');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step, router]);

    // Format Aadhaar number with spaces
    const formatAadhaar = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
        if (match) {
            return [match[1], match[2], match[3]].filter(Boolean).join(' ');
        }
        return cleaned;
    };

    // Validate form data
    const validateForm = (data: Partial<AadhaarFormData | OTPFormData>, schema: z.ZodSchema<any>) => {
        try {
            schema.parse(data);
            setErrors({});
            return true;
        } catch (error) {
            const fieldErrors: Record<string, string> = {};
            if (error instanceof z.ZodError) {
                error.errors?.forEach((err) => {
                    if (err.path) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
            }
            setErrors(fieldErrors);
            return false;
        }
    };

    // Handle Aadhaar verification
    const handleAadhaarVerification = async () => {
        const aadhaarData = {
            aadhaarNumber: formData.aadhaarNumber,
            captcha: formData.captcha,
            consent: formData.consent,
        };

        if (!validateForm(aadhaarData, aadhaarSchema)) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await verifyAadhaarAction(aadhaarData);

            if (result.success) {
                setTransactionId(result.transactionId || null);
                setStep('otp');
                setOtpTimer(60); // 60 second countdown for OTP resend
                setFormData((prev) => ({ ...prev, otp: '' }));
            } else {
                setErrors({ general: result.message });
            }
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP verification
    const handleOTPVerification = async () => {
        const otpData = { otp: formData.otp };

        if (!validateForm(otpData, otpSchema)) {
            return;
        }

        if (!transactionId) {
            setErrors({ otp: 'Invalid transaction. Please restart verification.' });
            return;
        }

        setIsLoading(true);
        try {
            const result = await verifyOTPAction(formData.otp, transactionId);

            if (result.success) {
                // Save eKYC data to database
                await saveEKYCDataAction({
                    method: 'aadhaar',
                    aadhaarNumber: formData.aadhaarNumber,
                    verificationStatus: 'verified',
                    verifiedAt: new Date(),
                    verificationData: result.userData,
                });

                setStep('complete');
            } else {
                setErrors({ otp: result.message });
            }
        } catch (error) {
            setErrors({ otp: 'OTP verification failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle DigiLocker authentication
    const handleDigiLockerAuth = async () => {
        setIsLoading(true);
        try {
            const result = await authenticateDigiLockerAction();

            if (result.success) {
                // Save eKYC data to database
                await saveEKYCDataAction({
                    method: 'digilocker',
                    verificationStatus: 'verified',
                    verifiedAt: new Date(),
                    verificationData: result.userData,
                });

                setStep('complete');
            } else {
                setErrors({ general: result.message });
            }
        } catch (error) {
            setErrors({ general: 'DigiLocker authentication failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='from-primary/5 via-background to-secondary/5 flex min-h-screen items-center justify-center bg-gradient-to-br p-4'>
            <div className='w-full max-w-2xl'>
                <div className='mb-8 text-center'>
                    <BackToHomeButton />
                    <h1 className='text-foreground text-2xl font-bold'>eKYC Verification</h1>
                    <p className='text-muted-foreground mt-2'>
                        Verify your identity to continue with PM Internship Program
                    </p>
                </div>

                <Card className='border-border shadow-lg'>
                    <CardHeader className='text-center'>
                        <div className='mb-4 flex justify-center'>
                            {step === 'complete' ? (
                                <CheckCircle className='h-12 w-12 text-green-600' />
                            ) : (
                                <Shield className='text-primary h-12 w-12' />
                            )}
                        </div>
                        <CardTitle>
                            {step === 'select' && 'Choose Verification Method'}
                            {step === 'verify' && 'Enter Details'}
                            {step === 'otp' && 'Verify OTP'}
                            {step === 'complete' && 'Verification Complete'}
                        </CardTitle>
                        <CardDescription>
                            {step === 'select' && 'Select your preferred method for identity verification'}
                            {step === 'verify' && 'Provide your details for verification'}
                            {step === 'otp' && 'Enter the OTP sent to your Aadhaar-linked mobile'}
                            {step === 'complete' && 'Your identity has been successfully verified'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {errors.general && (
                            <div className='bg-destructive/10 border-destructive/20 mb-4 rounded-md border p-3'>
                                <p className='text-destructive text-sm'>{errors.general}</p>
                            </div>
                        )}

                        {step === 'select' && (
                            <Tabs
                                value={selectedMethod}
                                onValueChange={(value) => setSelectedMethod(value as VerificationMethod)}
                            >
                                <TabsList className='grid w-full grid-cols-2'>
                                    <TabsTrigger value='aadhaar' className='flex items-center gap-2'>
                                        <CreditCard className='h-4 w-4' />
                                        Aadhaar
                                    </TabsTrigger>
                                    <TabsTrigger value='digilocker' className='flex items-center gap-2'>
                                        <FileText className='h-4 w-4' />
                                        DigiLocker
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value='aadhaar' className='mt-6 space-y-4'>
                                    <div className='bg-muted rounded-lg p-6 text-center'>
                                        <CreditCard className='text-primary mx-auto mb-4 h-16 w-16' />
                                        <h3 className='mb-2 font-semibold'>Aadhaar Verification</h3>
                                        <p className='text-muted-foreground mb-4 text-sm'>
                                            Verify your identity using your Aadhaar number. We'll send an OTP to your
                                            Aadhaar-linked mobile number.
                                        </p>
                                        <Button onClick={() => setStep('verify')} className='w-full'>
                                            Continue with Aadhaar
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value='digilocker' className='mt-6 space-y-4'>
                                    <div className='bg-muted rounded-lg p-6 text-center'>
                                        <FileText className='text-primary mx-auto mb-4 h-16 w-16' />
                                        <h3 className='mb-2 font-semibold'>DigiLocker Verification</h3>
                                        <p className='text-muted-foreground mb-4 text-sm'>
                                            Verify your identity using DigiLocker. Your documents will be automatically
                                            fetched.
                                        </p>
                                        <Button onClick={handleDigiLockerAuth} disabled={isLoading} className='w-full'>
                                            {isLoading ? 'Connecting...' : 'Continue with DigiLocker'}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}

                        {step === 'verify' && selectedMethod === 'aadhaar' && (
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor='aadhaar'>Aadhaar Number</Label>
                                    <Input
                                        id='aadhaar'
                                        type='text'
                                        placeholder='Enter 12-digit Aadhaar number'
                                        value={formData.aadhaarNumber}
                                        onChange={(e) =>
                                            setFormData({ ...formData, aadhaarNumber: formatAadhaar(e.target.value) })
                                        }
                                        maxLength={14}
                                    />
                                    {errors.aadhaarNumber && (
                                        <p className='text-destructive text-sm'>{errors.aadhaarNumber}</p>
                                    )}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='captcha'>CAPTCHA</Label>
                                    <div className='flex gap-2'>
                                        <div className='bg-muted rounded border p-3 text-center font-mono text-lg tracking-wider'>
                                            A7B9K
                                        </div>
                                        <Input
                                            id='captcha'
                                            type='text'
                                            placeholder='Enter CAPTCHA'
                                            value={formData.captcha}
                                            onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                                            maxLength={5}
                                        />
                                    </div>
                                    {errors.captcha && <p className='text-destructive text-sm'>{errors.captcha}</p>}
                                </div>

                                <div className='flex items-start space-x-2'>
                                    <Checkbox
                                        id='consent'
                                        checked={formData.consent}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, consent: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor='consent' className='text-sm leading-relaxed'>
                                        I hereby give my consent to UIDAI to authenticate my Aadhaar number for the
                                        purpose of identity verification for the PM Internship Program.
                                    </Label>
                                </div>
                                {errors.consent && <p className='text-destructive text-sm'>{errors.consent}</p>}

                                <Button onClick={handleAadhaarVerification} disabled={isLoading} className='w-full'>
                                    {isLoading ? 'Verifying...' : 'Verify Aadhaar'}
                                </Button>
                            </div>
                        )}

                        {step === 'otp' && (
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor='otp'>Enter OTP</Label>
                                    <Input
                                        id='otp'
                                        type='text'
                                        placeholder='Enter 6-digit OTP'
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                        maxLength={6}
                                        className='text-center text-lg tracking-widest'
                                    />
                                    {errors.otp && <p className='text-destructive text-sm'>{errors.otp}</p>}
                                    <p className='text-muted-foreground text-xs'>
                                        For demo purposes, use OTP:{' '}
                                        <span className='font-mono font-semibold'>123456</span>
                                    </p>
                                </div>

                                <div className='text-center'>
                                    {otpTimer > 0 ? (
                                        <p className='text-muted-foreground text-sm'>
                                            Resend OTP in {otpTimer} seconds
                                        </p>
                                    ) : (
                                        <Button
                                            variant='link'
                                            onClick={handleAadhaarVerification}
                                            className='text-primary'
                                        >
                                            Resend OTP
                                        </Button>
                                    )}
                                </div>

                                <Button onClick={handleOTPVerification} disabled={isLoading} className='w-full'>
                                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                                </Button>
                            </div>
                        )}

                        {step === 'complete' && (
                            <div className='space-y-4 text-center'>
                                <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
                                    <CheckCircle className='mx-auto mb-4 h-16 w-16 text-green-600' />
                                    <h3 className='mb-2 font-semibold text-green-800'>Verification Successful!</h3>
                                    <p className='text-sm text-green-700'>
                                        Your identity has been verified successfully. You will be redirected to complete
                                        your profile.
                                    </p>
                                </div>
                                <p className='text-muted-foreground text-sm'>
                                    Redirecting to profile setup in 3 seconds...
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EKYCPage;
