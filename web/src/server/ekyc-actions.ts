'use server';

import { z } from 'zod';
import { aadhaarSchema, otpSchema, ekycDataSchema } from '@/lib/validations/ekyc';

// Simulate Aadhaar verification API call
export const verifyAadhaarAction = async (data: z.infer<typeof aadhaarSchema>) => {
  try {
    // Validate the input data
    const validatedData = aadhaarSchema.parse(data);

    // Simulate API delay (realistic network delay)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock verification logic - in real app, this would call UIDAI API
    const mockSuccess = validatedData.aadhaarNumber && validatedData.captcha === 'A7B9K';

    if (mockSuccess) {
      return {
        success: true,
        message: 'OTP sent to your Aadhaar-linked mobile number',
        transactionId: 'TXN' + Date.now(),
      };
    } else {
      return {
        success: false,
        message: 'Invalid CAPTCHA or Aadhaar number. Please check and try again.',
      };
    }
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    return {
      success: false,
      message: 'Verification failed. Please try again.',
    };
  }
};

// Simulate OTP verification
export const verifyOTPAction = async (otp: string, transactionId: string) => {
  try {
    const validatedOTP = otpSchema.parse({ otp });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock OTP verification - in real app, this would verify with UIDAI
    const mockSuccess = validatedOTP.otp === '123456';

    if (mockSuccess) {
      // Mock verified user data that would come from UIDAI
      const mockUserData = {
        name: 'Rahul Kumar Singh',
        dob: '1995-06-15',
        address: '123 MG Road, Connaught Place, New Delhi 110001',
        gender: 'Male',
        mobile: '+91-98765*****',
      };

      return {
        success: true,
        message: 'Identity verified successfully',
        userData: mockUserData,
        transactionId, // Using the parameter to avoid unused warning
      };
    } else {
      return {
        success: false,
        message: 'Invalid OTP. Please enter the correct 6-digit OTP.',
      };
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      message: 'OTP verification failed. Please try again.',
    };
  }
};

// Simulate DigiLocker authentication
export const authenticateDigiLockerAction = async () => {
  try {
    // Simulate DigiLocker OAuth flow delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate random success/failure for more realistic testing
    const randomSuccess = Math.random() > 0.1; // 90% success rate

    if (randomSuccess) {
      // Mock DigiLocker user data
      const mockUserData = {
        name: 'Priya Sharma',
        dob: '1992-08-20',
        address: '456 Park Street, Bandra West, Mumbai 400050',
        gender: 'Female',
        documents: {
          aadhaar: 'Available',
          pan: 'Available',
          drivingLicense: 'Available',
        },
      };

      return {
        success: true,
        message: 'DigiLocker authentication successful',
        userData: mockUserData,
      };
    } else {
      return {
        success: false,
        message: 'DigiLocker authentication failed. Please try again or use Aadhaar verification.',
      };
    }
  } catch (error) {
    console.error('DigiLocker authentication error:', error);
    return {
      success: false,
      message: 'DigiLocker service temporarily unavailable. Please try again later.',
    };
  }
};

// Save eKYC data to database (mock implementation)
export const saveEKYCDataAction = async (data: z.infer<typeof ekycDataSchema>) => {
  try {
    const validatedData = ekycDataSchema.parse(data);

    // Simulate database save operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock database record
    const mockRecord = {
      id: 'ekyc_' + Date.now(),
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
      method: validatedData.method,
      verificationStatus: validatedData.verificationStatus,
      verifiedAt: validatedData.verifiedAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationData: validatedData.verificationData,
    };

    console.log('Mock: Saving eKYC data to database:', mockRecord);

    return {
      success: true,
      message: 'eKYC data saved successfully',
      id: mockRecord.id,
      record: mockRecord,
    };
  } catch (error) {
    console.error('Save eKYC data error:', error);
    return {
      success: false,
      message: 'Failed to save eKYC data. Please try again.',
    };
  }
};

// Additional helper action to check verification status
export const checkVerificationStatusAction = async (transactionId: string) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock status check
    const mockStatuses = ['pending', 'processing', 'verified', 'failed'];
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

    return {
      success: true,
      transactionId,
      status: randomStatus,
      message: `Verification status: ${randomStatus}`,
    };
  } catch (error) {
    console.error('Status check error:', error);
    return {
      success: false,
      message: 'Failed to check verification status',
    };
  }
};

// Action to resend OTP (separate from initial verification)
export const resendOTPAction = async (transactionId: string) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock resend logic
    const mockSuccess = transactionId && transactionId.startsWith('TXN');

    if (mockSuccess) {
      return {
        success: true,
        message: 'OTP resent successfully to your registered mobile number',
        transactionId,
      };
    } else {
      return {
        success: false,
        message: 'Invalid transaction. Please restart the verification process.',
      };
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    return {
      success: false,
      message: 'Failed to resend OTP. Please try again.',
    };
  }
};
