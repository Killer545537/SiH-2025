'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Award,
    CheckCircle,
    CreditCard,
    GraduationCap,
    Phone,
    Plus,
    Save,
    Trash2,
    Upload,
    User,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import validation schemas and server actions
import {
    BankData,
    ContactData,
    contactDataSchema,
    Education,
    Language,
    PersonalData,
    personalDataSchema,
    SkillsData,
} from '@/lib/validations/profile';

import {
    getProfileStatusAction,
    saveCompleteProfileAction,
    saveContactDataAction,
    savePersonalDataAction,
    sendEmailOTPAction,
    uploadFileAction,
    validateIFSCAction,
    verifyEmailOTPAction,
} from '@/server/profile-actions';

const ProfilePage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('personal');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [otpSent, setOtpSent] = useState(false);
    const [otpValue, setOtpValue] = useState('');

    // Mock eKYC data (this would come from the previous step)
    const [personalData, setPersonalData] = useState<PersonalData>({
        name: 'Rahul Kumar Singh',
        dob: '15/06/1995',
        gender: 'Male',
        fatherName: '',
        category: 'general',
        permanentAddress: {
            line1: '123 MG Road',
            line2: 'Connaught Place',
            state: 'Delhi',
            district: 'New Delhi',
            block: 'CP Block',
            village: 'New Delhi',
            pin: '110001',
        },
        currentAddress: {
            sameAsPermanent: true,
            line1: '',
            line2: '',
            state: '',
            district: '',
            block: '',
            village: '',
            pin: '',
        },
        disability: {
            hasDisability: false,
            type: '',
        },
    });

    const [contactData, setContactData] = useState<ContactData>({
        primaryMobile: '+91-98765*****',
        alternateMobile: '',
        email: '',
        emailVerified: false,
    });

    const [educations, setEducations] = useState<Education[]>([]);

    const [bankData, setBankData] = useState<BankData>({
        isAadhaarSeeded: false,
        accountNumber: '',
        ifsc: '',
        bankName: '',
        branch: '',
    });

    const [skillsData, setSkillsData] = useState<SkillsData>({
        skills: [],
        languages: [],
    });

    // Available skills
    const availableSkills = [
        'JavaScript',
        'Python',
        'Java',
        'React',
        'Node.js',
        'HTML/CSS',
        'Data Analysis',
        'Excel',
        'PowerPoint',
        'Communication',
        'Leadership',
        'Project Management',
        'Digital Marketing',
        'Content Writing',
        'Graphic Design',
        'SQL',
        'Machine Learning',
        'AI',
        'Cloud Computing',
        'DevOps',
        'Customer Service',
        'Sales',
        'Finance',
        'Accounting',
        'Research',
        'Problem Solving',
        'Team Work',
        'Time Management',
        'Public Speaking',
    ];

    // Calculate progress using server action
    const calculateProgress = async () => {
        const result = await getProfileStatusAction({
            personalData,
            contactData,
            educations,
            bankData,
            skillsData,
        });
        return result.success ? result.completionPercentage : 0;
    };

    const [progress, setProgress] = useState(0);

    // Update progress when data changes
    useEffect(() => {
        const updateProgress = async () => {
            const newProgress = await calculateProgress();
            setProgress(newProgress);
        };
        updateProgress();
    }, [personalData, contactData, educations, bankData, skillsData]);

    // Validation helper
    const validateSection = (data: any, schema: any, sectionName: string) => {
        try {
            schema.parse(data);
            setErrors((prev) => {
                const newErrors = { ...prev };
                Object.keys(newErrors).forEach((key) => {
                    if (key.startsWith(sectionName)) {
                        delete newErrors[key];
                    }
                });
                return newErrors;
            });
            return true;
        } catch (error: any) {
            if (error.errors) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err: any) => {
                    const field = err.path.join('.');
                    newErrors[`${sectionName}.${field}`] = err.message;
                });
                setErrors((prev) => ({ ...prev, ...newErrors }));
            }
            return false;
        }
    };

    // Education functions
    const addEducation = () => {
        const newEducation: Education = {
            id: Date.now().toString(),
            level: '10th',
            subject: '',
            board: '',
            institute: '',
            year: '',
            marksType: 'percentage',
            marksValue: '',
        };
        setEducations([...educations, newEducation]);
    };

    const removeEducation = (id: string) => {
        setEducations(educations.filter((edu) => edu.id !== id));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setEducations(educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
    };

    // Language functions
    const addLanguage = () => {
        const newLanguage: Language = {
            id: Date.now().toString(),
            name: '',
            proficiency: 'basic',
        };
        setSkillsData({
            ...skillsData,
            languages: [...skillsData.languages, newLanguage],
        });
    };

    const removeLanguage = (id: string) => {
        setSkillsData({
            ...skillsData,
            languages: skillsData.languages.filter((lang) => lang.id !== id),
        });
    };

    const updateLanguage = (id: string, field: keyof Language, value: string) => {
        setSkillsData({
            ...skillsData,
            languages: skillsData.languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)),
        });
    };

    // Skills functions
    const toggleSkill = (skill: string) => {
        const currentSkills = skillsData.skills;
        if (currentSkills.includes(skill)) {
            setSkillsData({
                ...skillsData,
                skills: currentSkills.filter((s) => s !== skill),
            });
        } else {
            setSkillsData({
                ...skillsData,
                skills: [...currentSkills, skill],
            });
        }
    };

    // Email verification functions
    const handleSendOTP = async () => {
        if (!contactData.email) return;

        setIsLoading(true);
        try {
            const result = await sendEmailOTPAction(contactData.email);
            if (result.success) {
                setOtpSent(true);
                // For demo purposes, show the OTP
                alert(`Demo OTP sent: ${result.mockOTP}`);
            } else {
                setErrors((prev) => ({ ...prev, 'contact.email': result.message }));
            }
        } catch (error) {
            setErrors((prev) => ({ ...prev, 'contact.email': 'Failed to send OTP' }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpValue || !contactData.email) return;

        setIsLoading(true);
        try {
            const result = await verifyEmailOTPAction({ email: contactData.email, otp: otpValue });
            if (result.success) {
                setContactData((prev) => ({ ...prev, emailVerified: true }));
                setOtpSent(false);
                setOtpValue('');
            } else {
                setErrors((prev) => ({ ...prev, 'contact.otp': result.message }));
            }
        } catch (error) {
            setErrors((prev) => ({ ...prev, 'contact.otp': 'OTP verification failed' }));
        } finally {
            setIsLoading(false);
        }
    };

    // IFSC validation
    const handleIFSCValidation = async (ifscCode: string) => {
        if (ifscCode.length === 11) {
            try {
                const result = await validateIFSCAction(ifscCode);
                if (result.success && result.bankDetails) {
                    setBankData((prev) => ({
                        ...prev,
                        ifsc: result.ifscCode,
                        bankName: result.bankDetails.bankName,
                        branch: result.bankDetails.branch,
                    }));
                }
            } catch (error) {
                console.error('IFSC validation error:', error);
            }
        }
    };

    // File upload handler
    const handleFileUpload = async (file: File, educationId: string) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadFileAction(formData);
            if (result.success) {
                // Update education with file info
                updateEducation(
                    educationId,
                    'marksValue',
                    `${educations.find((e) => e.id === educationId)?.marksValue} (Certificate: ${result.fileName})`
                );
                alert(`File uploaded successfully: ${result.fileName}`);
            } else {
                alert(`Upload failed: ${result.message}`);
            }
        } catch (error) {
            alert('File upload failed');
        }
    };

    // Save individual sections
    const savePersonalSection = async () => {
        if (!validateSection(personalData, personalDataSchema, 'personal')) return;

        setIsLoading(true);
        try {
            const result = await savePersonalDataAction(personalData);
            if (result.success) {
                alert('Personal information saved successfully!');
            }
        } catch (error) {
            alert('Failed to save personal information');
        } finally {
            setIsLoading(false);
        }
    };

    const saveContactSection = async () => {
        if (!validateSection(contactData, contactDataSchema, 'contact')) return;

        setIsLoading(true);
        try {
            const result = await saveContactDataAction(contactData);
            if (result.success) {
                alert('Contact information saved successfully!');
            }
        } catch (error) {
            alert('Failed to save contact information');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle complete profile save
    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const completeProfile = {
                personalData,
                contactData,
                educations,
                bankData,
                skillsData,
            };

            const result = await saveCompleteProfileAction(completeProfile);

            if (result.success) {
                alert(`Profile completed successfully! Profile ID: ${result.profileId}`);
                router.push('/dashboard');
            } else {
                alert(`Profile save failed: ${result.message}`);
                if (result.errors) {
                    console.error('Validation errors:', result.errors);
                }
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('An unexpected error occurred while saving your profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='from-primary/5 via-background to-secondary/5 min-h-screen bg-gradient-to-br p-4'>
            <div className='mx-auto max-w-4xl'>
                <div className='mb-8'>
                    <Link href='/ekyc' className='text-primary hover:text-primary/80 mb-4 inline-flex items-center'>
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        Back
                    </Link>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-foreground text-2xl font-bold'>Complete Your Profile</h1>
                            <p className='text-muted-foreground mt-2'>Fill in your details to apply for internships</p>
                        </div>
                        <div className='text-right'>
                            <div className='text-muted-foreground mb-2 text-sm'>Profile Completion</div>
                            <div className='flex items-center gap-2'>
                                <Progress value={progress} className='w-32' />
                                <span className='text-sm font-medium'>{Math.round(progress)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
                    <TabsList className='grid w-full grid-cols-5'>
                        <TabsTrigger value='personal' className='flex items-center gap-2'>
                            <User className='h-4 w-4' />
                            Personal
                        </TabsTrigger>
                        <TabsTrigger value='contact' className='flex items-center gap-2'>
                            <Phone className='h-4 w-4' />
                            Contact
                        </TabsTrigger>
                        <TabsTrigger value='education' className='flex items-center gap-2'>
                            <GraduationCap className='h-4 w-4' />
                            Education
                        </TabsTrigger>
                        <TabsTrigger value='bank' className='flex items-center gap-2'>
                            <CreditCard className='h-4 w-4' />
                            Bank
                        </TabsTrigger>
                        <TabsTrigger value='skills' className='flex items-center gap-2'>
                            <Award className='h-4 w-4' />
                            Skills
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value='personal'>
                        <Card>
                            <CardHeader>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <CardTitle>Personal Details</CardTitle>
                                        <CardDescription>
                                            Your basic information (auto-filled from eKYC)
                                        </CardDescription>
                                    </div>
                                    <Button onClick={savePersonalSection} variant='outline' size='sm'>
                                        <Save className='mr-2 h-4 w-4' />
                                        Save Section
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                {/* Display validation errors */}
                                {Object.entries(errors).filter(([key]) => key.startsWith('personal')).length > 0 && (
                                    <div className='bg-destructive/10 border-destructive/20 rounded-md border p-3'>
                                        <h4 className='text-destructive mb-2 text-sm font-medium'>
                                            Please fix the following errors:
                                        </h4>
                                        <ul className='text-destructive space-y-1 text-xs'>
                                            {Object.entries(errors)
                                                .filter(([key]) => key.startsWith('personal'))
                                                .map(([key, message]) => (
                                                    <li key={key}>• {message}</li>
                                                ))}
                                        </ul>
                                    </div>
                                )}

                                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                    <div className='space-y-2'>
                                        <Label>Full Name</Label>
                                        <Input value={personalData.name} disabled className='bg-muted' />
                                        <p className='text-muted-foreground text-xs'>Auto-filled from eKYC</p>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label>Date of Birth</Label>
                                        <Input value={personalData.dob} disabled className='bg-muted' />
                                        <p className='text-muted-foreground text-xs'>Auto-filled from eKYC</p>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label>Gender</Label>
                                        <Input value={personalData.gender} disabled className='bg-muted' />
                                        <p className='text-muted-foreground text-xs'>Auto-filled from eKYC</p>
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='fatherName'>Father's/Guardian's Name *</Label>
                                        <Input
                                            id='fatherName'
                                            value={personalData.fatherName}
                                            onChange={(e) =>
                                                setPersonalData({ ...personalData, fatherName: e.target.value })
                                            }
                                            placeholder="Enter father's/guardian's name"
                                            className={errors['personal.fatherName'] ? 'border-destructive' : ''}
                                        />
                                        {errors['personal.fatherName'] && (
                                            <p className='text-destructive text-xs'>{errors['personal.fatherName']}</p>
                                        )}
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='category'>Category *</Label>
                                        <Select
                                            value={personalData.category}
                                            onValueChange={(value) =>
                                                setPersonalData({ ...personalData, category: value as any })
                                            }
                                        >
                                            <SelectTrigger
                                                className={errors['personal.category'] ? 'border-destructive' : ''}
                                            >
                                                <SelectValue placeholder='Select category' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='general'>General</SelectItem>
                                                <SelectItem value='obc'>OBC</SelectItem>
                                                <SelectItem value='sc'>SC</SelectItem>
                                                <SelectItem value='st'>ST</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors['personal.category'] && (
                                            <p className='text-destructive text-xs'>{errors['personal.category']}</p>
                                        )}
                                    </div>
                                </div>

                                <div className='space-y-4'>
                                    <h3 className='text-lg font-semibold'>Permanent Address</h3>
                                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                        <div className='space-y-2'>
                                            <Label>Address Line 1</Label>
                                            <Input
                                                value={personalData.permanentAddress.line1}
                                                onChange={(e) =>
                                                    setPersonalData({
                                                        ...personalData,
                                                        permanentAddress: {
                                                            ...personalData.permanentAddress,
                                                            line1: e.target.value,
                                                        },
                                                    })
                                                }
                                                placeholder='House/Flat No., Street'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Address Line 2</Label>
                                            <Input
                                                value={personalData.permanentAddress.line2}
                                                onChange={(e) =>
                                                    setPersonalData({
                                                        ...personalData,
                                                        permanentAddress: {
                                                            ...personalData.permanentAddress,
                                                            line2: e.target.value,
                                                        },
                                                    })
                                                }
                                                placeholder='Area, Landmark'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>State</Label>
                                            <Input
                                                value={personalData.permanentAddress.state}
                                                onChange={(e) =>
                                                    setPersonalData({
                                                        ...personalData,
                                                        permanentAddress: {
                                                            ...personalData.permanentAddress,
                                                            state: e.target.value,
                                                        },
                                                    })
                                                }
                                                placeholder='State'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>District</Label>
                                            <Input
                                                value={personalData.permanentAddress.district}
                                                onChange={(e) =>
                                                    setPersonalData({
                                                        ...personalData,
                                                        permanentAddress: {
                                                            ...personalData.permanentAddress,
                                                            district: e.target.value,
                                                        },
                                                    })
                                                }
                                                placeholder='District'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Block</Label>
                                            <Input
                                                value={personalData.permanentAddress.block}
                                                onChange={(e) =>
                                                    setPersonalData({
                                                        ...personalData,
                                                        permanentAddress: {
                                                            ...personalData.permanentAddress,
                                                            block: e.target.value,
                                                        },
                                                    })
                                                }
                                                placeholder='Block'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Village/City</Label>
                                            <Input
                                                value={personalData.permanentAddress.village}
                                                onChange={(e) =>
                                                    setPersonalData({
                                                        ...personalData,
                                                        permanentAddress: {
                                                            ...personalData.permanentAddress,
                                                            village: e.target.value,
                                                        },
                                                    })
                                                }
                                                placeholder='Village/City'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>PIN Code</Label>
                                            <Input
                                                value={personalData.permanentAddress.pin}
                                                onChange={(e) =>
                                                    setPersonalData({
                                                        ...personalData,
                                                        permanentAddress: {
                                                            ...personalData.permanentAddress,
                                                            pin: e.target.value,
                                                        },
                                                    })
                                                }
                                                placeholder='PIN Code'
                                                maxLength={6}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='space-y-4'>
                                    <div className='flex items-center space-x-2'>
                                        <Checkbox
                                            id='sameAddress'
                                            checked={personalData.currentAddress.sameAsPermanent}
                                            onCheckedChange={(checked) =>
                                                setPersonalData({
                                                    ...personalData,
                                                    currentAddress: {
                                                        ...personalData.currentAddress,
                                                        sameAsPermanent: checked as boolean,
                                                    },
                                                })
                                            }
                                        />
                                        <Label htmlFor='sameAddress'>
                                            Current address is same as permanent address
                                        </Label>
                                    </div>
                                </div>

                                <div className='space-y-4'>
                                    <h3 className='text-lg font-semibold'>Disability Status</h3>
                                    <div className='flex items-center space-x-4'>
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                id='hasDisability'
                                                checked={personalData.disability.hasDisability}
                                                onCheckedChange={(checked) =>
                                                    setPersonalData({
                                                        ...personalData,
                                                        disability: {
                                                            ...personalData.disability,
                                                            hasDisability: checked as boolean,
                                                        },
                                                    })
                                                }
                                            />
                                            <Label htmlFor='hasDisability'>I have a disability</Label>
                                        </div>
                                    </div>
                                    {personalData.disability.hasDisability && (
                                        <div className='space-y-2'>
                                            <Label>Type of Disability</Label>
                                            <Input
                                                value={personalData.disability.type}
                                                onChange={(e) =>
                                                    setPersonalData({
                                                        ...personalData,
                                                        disability: {
                                                            ...personalData.disability,
                                                            type: e.target.value,
                                                        },
                                                    })
                                                }
                                                placeholder='Specify type of disability'
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='contact'>
                        <Card>
                            <CardHeader>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <CardTitle>Contact Details</CardTitle>
                                        <CardDescription>Your contact information</CardDescription>
                                    </div>
                                    <Button onClick={saveContactSection} variant='outline' size='sm'>
                                        <Save className='mr-2 h-4 w-4' />
                                        Save Section
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                {/* Display validation errors */}
                                {Object.entries(errors).filter(([key]) => key.startsWith('contact')).length > 0 && (
                                    <div className='bg-destructive/10 border-destructive/20 rounded-md border p-3'>
                                        <h4 className='text-destructive mb-2 text-sm font-medium'>
                                            Please fix the following errors:
                                        </h4>
                                        <ul className='text-destructive space-y-1 text-xs'>
                                            {Object.entries(errors)
                                                .filter(([key]) => key.startsWith('contact'))
                                                .map(([key, message]) => (
                                                    <li key={key}>• {message}</li>
                                                ))}
                                        </ul>
                                    </div>
                                )}

                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <Label>Primary Mobile</Label>
                                        <Input value={contactData.primaryMobile} disabled className='bg-muted' />
                                        <p className='text-muted-foreground text-xs'>Auto-filled from registration</p>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='alternateMobile'>Alternate Mobile (Optional)</Label>
                                        <Input
                                            id='alternateMobile'
                                            value={contactData.alternateMobile}
                                            onChange={(e) =>
                                                setContactData({ ...contactData, alternateMobile: e.target.value })
                                            }
                                            placeholder='Enter alternate mobile number'
                                            maxLength={10}
                                        />
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='email'>Email ID *</Label>
                                    <div className='flex gap-2'>
                                        <Input
                                            id='email'
                                            type='email'
                                            value={contactData.email}
                                            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                                            placeholder='Enter your email address'
                                            className={`flex-1 ${errors['contact.email'] ? 'border-destructive' : ''}`}
                                            disabled={contactData.emailVerified}
                                        />
                                        <Button
                                            variant='outline'
                                            disabled={!contactData.email || contactData.emailVerified || isLoading}
                                            onClick={handleSendOTP}
                                            className='bg-transparent whitespace-nowrap'
                                        >
                                            {contactData.emailVerified ? (
                                                <>
                                                    <CheckCircle className='mr-2 h-4 w-4 text-green-600' />
                                                    Verified
                                                </>
                                            ) : isLoading ? (
                                                'Sending...'
                                            ) : (
                                                'Send OTP'
                                            )}
                                        </Button>
                                    </div>
                                    {errors['contact.email'] && (
                                        <p className='text-destructive text-xs'>{errors['contact.email']}</p>
                                    )}
                                    {contactData.emailVerified && (
                                        <p className='text-xs text-green-600'>Email verified successfully</p>
                                    )}
                                </div>

                                {/* OTP Verification */}
                                {otpSent && !contactData.emailVerified && (
                                    <div className='space-y-2'>
                                        <Label htmlFor='otp'>Enter OTP *</Label>
                                        <div className='flex gap-2'>
                                            <Input
                                                id='otp'
                                                value={otpValue}
                                                onChange={(e) => setOtpValue(e.target.value)}
                                                placeholder='Enter 6-digit OTP'
                                                maxLength={6}
                                                className={errors['contact.otp'] ? 'border-destructive' : ''}
                                            />
                                            <Button onClick={handleVerifyOTP} disabled={!otpValue || isLoading}>
                                                {isLoading ? 'Verifying...' : 'Verify'}
                                            </Button>
                                        </div>
                                        {errors['contact.otp'] && (
                                            <p className='text-destructive text-xs'>{errors['contact.otp']}</p>
                                        )}
                                        <p className='text-muted-foreground text-xs'>
                                            For demo: Use OTP <span className='font-mono font-semibold'>123456</span>
                                        </p>
                                    </div>
                                )}

                                {/* ...rest of contact form... */}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='education'>
                        <Card>
                            <CardHeader>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <CardTitle>Educational Qualifications</CardTitle>
                                        <CardDescription>Add your educational background</CardDescription>
                                    </div>
                                    <Button onClick={addEducation} className='flex items-center gap-2'>
                                        <Plus className='h-4 w-4' />
                                        Add Education
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                {educations.length === 0 ? (
                                    <div className='text-muted-foreground py-8 text-center'>
                                        <GraduationCap className='mx-auto mb-4 h-12 w-12 opacity-50' />
                                        <p>No educational qualifications added yet.</p>
                                        <p className='text-sm'>Click "Add Education" to get started.</p>
                                    </div>
                                ) : (
                                    educations.map((education, index) => (
                                        <Card key={education.id} className='border-border'>
                                            <CardHeader className='pb-4'>
                                                <div className='flex items-center justify-between'>
                                                    <CardTitle className='text-lg'>Education #{index + 1}</CardTitle>
                                                    <Button
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={() => removeEducation(education.id)}
                                                        className='text-destructive hover:text-destructive'
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className='space-y-4'>
                                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                    <div className='space-y-2'>
                                                        <Label>Course Level *</Label>
                                                        <Select
                                                            value={education.level}
                                                            onValueChange={(value) =>
                                                                updateEducation(education.id, 'level', value)
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select level' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='10th'>10th Standard</SelectItem>
                                                                <SelectItem value='12th'>12th Standard</SelectItem>
                                                                <SelectItem value='diploma'>Diploma</SelectItem>
                                                                <SelectItem value='graduation'>Graduation</SelectItem>
                                                                <SelectItem value='postgraduation'>
                                                                    Post Graduation
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className='space-y-2'>
                                                        <Label>Subject/Stream</Label>
                                                        <Input
                                                            value={education.subject}
                                                            onChange={(e) =>
                                                                updateEducation(education.id, 'subject', e.target.value)
                                                            }
                                                            placeholder='e.g., Science, Commerce, Arts'
                                                        />
                                                    </div>
                                                    <div className='space-y-2'>
                                                        <Label>Board/University *</Label>
                                                        <Input
                                                            value={education.board}
                                                            onChange={(e) =>
                                                                updateEducation(education.id, 'board', e.target.value)
                                                            }
                                                            placeholder='e.g., CBSE, State Board, University name'
                                                        />
                                                    </div>
                                                    <div className='space-y-2'>
                                                        <Label>Institute Name *</Label>
                                                        <Input
                                                            value={education.institute}
                                                            onChange={(e) =>
                                                                updateEducation(
                                                                    education.id,
                                                                    'institute',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder='School/College name'
                                                        />
                                                    </div>
                                                    <div className='space-y-2'>
                                                        <Label>Year of Passing *</Label>
                                                        <Input
                                                            value={education.year}
                                                            onChange={(e) =>
                                                                updateEducation(education.id, 'year', e.target.value)
                                                            }
                                                            placeholder='e.g., 2023'
                                                            maxLength={4}
                                                        />
                                                    </div>
                                                    <div className='space-y-2'>
                                                        <Label>Marks Type *</Label>
                                                        <Select
                                                            value={education.marksType}
                                                            onValueChange={(value) =>
                                                                updateEducation(education.id, 'marksType', value)
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select type' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='percentage'>
                                                                    Percentage (%)
                                                                </SelectItem>
                                                                <SelectItem value='cgpa'>CGPA</SelectItem>
                                                                <SelectItem value='grade'>Grade</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                    <div className='space-y-2'>
                                                        <Label>Marks Value *</Label>
                                                        <Input
                                                            value={education.marksValue}
                                                            onChange={(e) =>
                                                                updateEducation(
                                                                    education.id,
                                                                    'marksValue',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder='Enter marks/CGPA/grade'
                                                        />
                                                    </div>
                                                    <div className='space-y-2'>
                                                        <Label>Upload Certificate (≤ 2 MB)</Label>
                                                        <div className='flex items-center gap-2'>
                                                            <Input
                                                                type='file'
                                                                accept='.pdf,.jpg,.jpeg,.png'
                                                                className='flex-1'
                                                            />
                                                            <Button variant='outline' size='sm'>
                                                                <Upload className='h-4 w-4' />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='bank'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Bank Details</CardTitle>
                                <CardDescription>Your banking information for stipend payments</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='aadhaarSeeded'
                                        checked={bankData.isAadhaarSeeded}
                                        onCheckedChange={(checked) =>
                                            setBankData({ ...bankData, isAadhaarSeeded: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor='aadhaarSeeded'>
                                        Is your bank account Aadhaar-seeded and NPCI-linked?
                                    </Label>
                                </div>

                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='accountNumber'>Bank Account Number *</Label>
                                        <Input
                                            id='accountNumber'
                                            value={bankData.accountNumber}
                                            onChange={(e) =>
                                                setBankData({ ...bankData, accountNumber: e.target.value })
                                            }
                                            placeholder='Enter account number'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='ifsc'>IFSC Code *</Label>
                                        <Input
                                            id='ifsc'
                                            value={bankData.ifsc}
                                            onChange={(e) =>
                                                setBankData({ ...bankData, ifsc: e.target.value.toUpperCase() })
                                            }
                                            placeholder='Enter IFSC code'
                                            maxLength={11}
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='bankName'>Bank Name *</Label>
                                        <Input
                                            id='bankName'
                                            value={bankData.bankName}
                                            onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                                            placeholder='Enter bank name'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='branch'>Branch Name *</Label>
                                        <Input
                                            id='branch'
                                            value={bankData.branch}
                                            onChange={(e) => setBankData({ ...bankData, branch: e.target.value })}
                                            placeholder='Enter branch name'
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='skills'>
                        <div className='space-y-6'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Skills</CardTitle>
                                    <CardDescription>Select your skills and competencies</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4'>
                                        {availableSkills.map((skill) => (
                                            <div key={skill} className='flex items-center space-x-2'>
                                                <Checkbox
                                                    id={skill}
                                                    checked={skillsData.skills.includes(skill)}
                                                    onCheckedChange={() => toggleSkill(skill)}
                                                />
                                                <Label htmlFor={skill} className='text-sm'>
                                                    {skill}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    {skillsData.skills.length > 0 && (
                                        <div className='mt-4'>
                                            <Label className='text-sm font-medium'>Selected Skills:</Label>
                                            <div className='mt-2 flex flex-wrap gap-2'>
                                                {skillsData.skills.map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant='secondary'
                                                        className='cursor-pointer'
                                                        onClick={() => toggleSkill(skill)}
                                                    >
                                                        {skill} ×
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <CardTitle>Languages</CardTitle>
                                            <CardDescription>Add languages you can speak/write</CardDescription>
                                        </div>
                                        <Button onClick={addLanguage} className='flex items-center gap-2'>
                                            <Plus className='h-4 w-4' />
                                            Add Language
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    {skillsData.languages.length === 0 ? (
                                        <div className='text-muted-foreground py-8 text-center'>
                                            <Award className='mx-auto mb-4 h-12 w-12 opacity-50' />
                                            <p>No languages added yet.</p>
                                            <p className='text-sm'>Click "Add Language" to get started.</p>
                                        </div>
                                    ) : (
                                        skillsData.languages.map((language) => (
                                            <div
                                                key={language.id}
                                                className='flex items-center gap-4 rounded-lg border p-4'
                                            >
                                                <div className='grid flex-1 grid-cols-1 gap-4 md:grid-cols-2'>
                                                    <div className='space-y-2'>
                                                        <Label>Language</Label>
                                                        <Input
                                                            value={language.name}
                                                            onChange={(e) =>
                                                                updateLanguage(language.id, 'name', e.target.value)
                                                            }
                                                            placeholder='e.g., Hindi, English'
                                                        />
                                                    </div>
                                                    <div className='space-y-2'>
                                                        <Label>Proficiency</Label>
                                                        <Select
                                                            value={language.proficiency}
                                                            onValueChange={(value) =>
                                                                updateLanguage(language.id, 'proficiency', value)
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select proficiency' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='basic'>Basic</SelectItem>
                                                                <SelectItem value='intermediate'>
                                                                    Intermediate
                                                                </SelectItem>
                                                                <SelectItem value='advanced'>Advanced</SelectItem>
                                                                <SelectItem value='native'>Native</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() => removeLanguage(language.id)}
                                                    className='text-destructive hover:text-destructive'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className='flex items-center justify-between pt-6'>
                    <div className='text-muted-foreground text-sm'>
                        Profile {Math.round(progress)}% complete
                        {Object.keys(errors).length > 0 && (
                            <span className='text-destructive ml-2'>({Object.keys(errors).length} errors to fix)</span>
                        )}
                    </div>
                    <Button
                        onClick={handleSaveProfile}
                        disabled={isLoading || progress < 100}
                        size='lg'
                        className='flex items-center gap-2'
                    >
                        <Save className='h-4 w-4' />
                        {isLoading ? 'Saving Profile...' : 'Save & Continue'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
