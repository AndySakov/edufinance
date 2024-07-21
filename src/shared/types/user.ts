import { MyFinancialAidInfo } from "./financial-aid/application";

export type Role = "admin" | "student" | "super-admin";

export type StudentDetails = {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: "male" | "female";
  phoneNumber: string;
  nationality: string;
  dateOfBirth: Date;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  studentId: string;
  programme: string | null;
};

export type AdminDetails = {
  firstName: string;
  lastName: string;
};

export interface User {
  id: number;
  email: string;
  role: Role;
  details: StudentDetails | AdminDetails;
  permissions: string[];
}

export interface UserProfile extends User {
  financialAidInfo: MyFinancialAidInfo | null;
}

export type AuthenticatedUser = User & {
  token: string;
};

export type Student = {
  id: number;
  index: string;
  email: string;
} & StudentDetails;

export type StudentProfile = Omit<Student, "index"> & {
  financialAidInfo: MyFinancialAidInfo | null;
};

export type Admin = {
  id: number;
  index: string;
  email: string;
  permissions: string[];
} & AdminDetails;

export const userToStudent = (user: User, index: number): Student => {
  return {
    id: user.id,
    index: index.toString(),
    email: user.email,
    ...(user.details as unknown as StudentDetails),
    programme: (user.details as unknown as StudentDetails).programme ?? "N/A",
  };
};

export const userToAdmin = (user: User, index: number): Admin => {
  return {
    id: user.id,
    index: index.toString(),
    email: user.email,
    permissions: user.permissions,
    ...(user.details as unknown as AdminDetails),
  };
};

export const studentProfileParser = (user: UserProfile): StudentProfile => {
  return {
    id: user.id,
    email: user.email,
    ...(user.details as unknown as StudentDetails),
    programme: (user.details as unknown as StudentDetails).programme ?? "N/A",
    financialAidInfo: user.financialAidInfo ?? null,
  };
};
