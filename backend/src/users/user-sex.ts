export const USER_SEXES = ['male', 'female'] as const;
export type UserSex = (typeof USER_SEXES)[number];
