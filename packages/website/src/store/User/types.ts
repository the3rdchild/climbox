import type { Site } from '../Sites/types';

export type AdminLevel = 'default' | 'site_manager' | 'super_admin';

export interface User {
  id: string; // Changed from number
  email: string;
  fullName: string;
  adminLevel: 'user' | 'manager' | 'admin';
  firebaseUid: string;
  organization: string;
  collection?: {
    id: string;
    siteIds: string[];
  };
  token?: string;
}

export interface UserState {
  userInfo: User | null;
  loading: boolean;
  loadingCollection: boolean;
  error?: string | null;
}

export interface UserRegisterParams {
  fullName: string;
  organization: string;
  email: string;
  password: string;
}

export interface UserSignInParams {
  email: string;
  password: string;
}

export interface PasswordResetParams {
  email: string;
}

export interface CreateUserCollectionRequestParams {
  name: string;
  siteIds: string[];
  token?: string;
  isPublic?: boolean;
}
