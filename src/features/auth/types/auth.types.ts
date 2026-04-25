export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type DocumentType = "CC" | "CE" | "NIT" | "PT";

export type RegisterCredentials = {
  documentType: DocumentType;
  documentNumber: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
};
