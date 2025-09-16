import { relations } from 'drizzle-orm';
import {
    boolean,
    date,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    smallint,
    text,
    timestamp,
    uuid,
    uniqueIndex,
} from 'drizzle-orm/pg-core';

import { user } from '@/db/schema/auth-schema';

export const reservationCategoryEnum = pgEnum('reservation_category', ['general', 'obc', 'sc', 'st']);
export const educationLevelEnum = pgEnum('education_level', ['10th', '12th', 'diploma', 'graduation', 'postgraduation']);
export const educationMarksTypeEnum = pgEnum('education_marks_type', ['percentage', 'cgpa', 'grade']);
export const languageProficiencyEnum = pgEnum('language_proficiency', ['basic', 'intermediate', 'advanced', 'native']);
export const ekycMethodEnum = pgEnum('ekyc_method', ['aadhaar', 'digilocker']);
export const ekycStatusEnum = pgEnum('ekyc_status', ['pending', 'verified', 'failed']);

export const profiles = pgTable('profiles', {
    userId: text('user_id')
        .primaryKey()
        .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name'),
    dob: date('dob'),
    gender: text('gender'),
    fatherName: text('father_name'),
    category: reservationCategoryEnum('category'),
    hasDisability: boolean('has_disability').default(false).notNull(),
    disabilityType: text('disability_type'),
    permanentAddressLine1: text('permanent_address_line1'),
    permanentAddressLine2: text('permanent_address_line2'),
    permanentState: text('permanent_state'),
    permanentDistrict: text('permanent_district'),
    permanentBlock: text('permanent_block'),
    permanentVillage: text('permanent_village'),
    permanentPin: text('permanent_pin'),
    currentAddressSameAsPermanent: boolean('current_address_same_as_permanent').default(false).notNull(),
    currentAddressLine1: text('current_address_line1'),
    currentAddressLine2: text('current_address_line2'),
    currentState: text('current_state'),
    currentDistrict: text('current_district'),
    currentBlock: text('current_block'),
    currentVillage: text('current_village'),
    currentPin: text('current_pin'),
    isEmailVerified: boolean('is_email_verified').default(false).notNull(),
    emailVerifiedAt: timestamp('email_verified_at'),
    email: text('email'),
    primaryMobile: text('primary_mobile'),
    alternateMobile: text('alternate_mobile'),
    photoUrl: text('photo_url'),
    isComplete: boolean('is_complete').default(false).notNull(),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const profilesRelations = relations(profiles, ({ one, many }) => ({
    user: one(user, {
        fields: [profiles.userId],
        references: [user.id],
    }),
    bankDetails: one(profileBankDetails, {
        fields: [profiles.userId],
        references: [profileBankDetails.profileId],
    }),
    educations: many(profileEducations),
    skills: many(profileSkills),
    languages: many(profileLanguages),
}));

export const profileBankDetails = pgTable('profile_bank_details', {
    profileId: text('profile_id')
        .primaryKey()
        .references(() => profiles.userId, { onDelete: 'cascade' }),
    isAadhaarSeeded: boolean('is_aadhaar_seeded').default(false).notNull(),
    accountNumber: text('account_number').notNull(),
    ifsc: text('ifsc').notNull(),
    bankName: text('bank_name').notNull(),
    branch: text('branch').notNull(),
    accountHolderName: text('account_holder_name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const profileBankDetailsRelations = relations(profileBankDetails, ({ one }) => ({
    profile: one(profiles, {
        fields: [profileBankDetails.profileId],
        references: [profiles.userId],
    }),
}));

export const profileEducations = pgTable('profile_educations', {
    id: uuid('id').defaultRandom().primaryKey(),
    profileId: text('profile_id')
        .notNull()
        .references(() => profiles.userId, { onDelete: 'cascade' }),
    level: educationLevelEnum('level').notNull(),
    subject: text('subject'),
    board: text('board').notNull(),
    institute: text('institute').notNull(),
    yearOfPassing: smallint('year_of_passing').notNull(),
    marksType: educationMarksTypeEnum('marks_type').notNull(),
    marksValue: text('marks_value').notNull(),
    certificateUrl: text('certificate_url'),
    certificateFileName: text('certificate_file_name'),
    certificateFileSize: integer('certificate_file_size'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const profileEducationsRelations = relations(profileEducations, ({ one }) => ({
    profile: one(profiles, {
        fields: [profileEducations.profileId],
        references: [profiles.userId],
    }),
}));

export const profileSkills = pgTable(
    'profile_skills',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        profileId: text('profile_id')
            .notNull()
            .references(() => profiles.userId, { onDelete: 'cascade' }),
        skill: text('skill').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => ({
        profileSkillUnique: uniqueIndex('profile_skills_profile_id_skill_unique').on(table.profileId, table.skill),
    })
);

export const profileSkillsRelations = relations(profileSkills, ({ one }) => ({
    profile: one(profiles, {
        fields: [profileSkills.profileId],
        references: [profiles.userId],
    }),
}));

export const profileLanguages = pgTable(
    'profile_languages',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        profileId: text('profile_id')
            .notNull()
            .references(() => profiles.userId, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        proficiency: languageProficiencyEnum('proficiency').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => ({
        profileLanguageUnique: uniqueIndex('profile_languages_profile_id_name_unique').on(table.profileId, table.name),
    })
);

export const profileLanguagesRelations = relations(profileLanguages, ({ one }) => ({
    profile: one(profiles, {
        fields: [profileLanguages.profileId],
        references: [profiles.userId],
    }),
}));

export const ekycVerifications = pgTable('ekyc_verifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    method: ekycMethodEnum('method').notNull(),
    status: ekycStatusEnum('status').default('pending').notNull(),
    transactionId: text('transaction_id'),
    aadhaarLastFour: text('aadhaar_last_four'),
    digilockerReference: text('digilocker_reference'),
    consentGiven: boolean('consent_given').default(false).notNull(),
    verificationData: jsonb('verification_data'),
    verifiedAt: timestamp('verified_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const ekycVerificationsRelations = relations(ekycVerifications, ({ one }) => ({
    user: one(user, {
        fields: [ekycVerifications.userId],
        references: [user.id],
    }),
}));
