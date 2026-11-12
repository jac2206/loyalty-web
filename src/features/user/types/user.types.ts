export type UserProfile = {
  id?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  documentType?: string;
  documentNumber?: string;
};

export type UpdateUserRequest = {
  fullName: string;
  email: string;
};
