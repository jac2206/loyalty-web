export type AccumulateFormValues = {
  partnerCode: string;
  locationCode: string;
  amount: string;
  reference: string;
};

export type AccumulateRequest = {
  documentType: string;
  documentNumber: string;
  partnerCode: string;
  locationCode: string;
  amount: number;
  reference: string;
};

export type RedeemFormValues = {
  partnerCode: string;
  locationCode: string;
  points: string;
  reference: string;
};

export type RedeemRequest = {
  documentType: string;
  documentNumber: string;
  partnerCode: string;
  locationCode: string;
  points: number;
  reference: string;
};

export type TransactionResponse = {
  id?: string;
  type?: string;
  points?: number;
  balance?: number;
  message?: string;
};

export type TransactionType = "ACUM" | "REDEM" | "ACCUMULATE" | "REDEEM" | string;

export type Transaction = {
  id?: string;
  type?: TransactionType;
  points?: number;
  amount?: number;
  reference?: string;
  status?: string;
  createdAt?: string;
  date?: string;
};

export type TransactionsResponse =
  | Transaction[]
  | {
      transactions?: Transaction[];
      data?: Transaction[];
    };
