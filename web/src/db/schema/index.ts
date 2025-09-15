import { account, session, user, verification } from '@/db/schema/auth-schema';
import {
    ekycVerifications,
    profileBankDetails,
    profileEducations,
    profileLanguages,
    profileSkills,
    profiles,
} from '@/db/schema/onboarding-schema';

export const schema = {
    user,
    verification,
    account,
    session,
    profiles,
    profileBankDetails,
    profileEducations,
    profileSkills,
    profileLanguages,
    ekycVerifications,
};

export {
    profiles,
    profileBankDetails,
    profileEducations,
    profileSkills,
    profileLanguages,
    ekycVerifications,
};
