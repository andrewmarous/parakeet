export const Role = {
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export type RoleT = (typeof Role)[keyof typeof Role];

export interface SessionPublicMetadata {
  role?: RoleT;
  onboarding?: "complete";
}

export interface ClerkAPIError {
  code: string;
  message: string;
  longMessage?: string;
  meta?: {
    paramName?: string;
    sessionId?: string;
    emailAddresses?: string[];
    identifiers?: string[];
    zxcvbn?: {
      suggestions: {
        code: string;
        message: string;
      }[];
    };
    permissions?: string[];
  };
}
