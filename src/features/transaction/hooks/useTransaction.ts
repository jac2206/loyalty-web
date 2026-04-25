"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { userService } from "@/features/user/services/userService";
import { transactionService } from "../services/transactionService";
import type {
  AccumulateFormValues,
  RedeemFormValues,
  TransactionResponse,
} from "../types/transaction.types";

type AccumulateFormErrors = Partial<Record<keyof AccumulateFormValues, string>>;
type RedeemFormErrors = Partial<Record<keyof RedeemFormValues, string>>;

type UseTransactionState = {
  accumulateValues: AccumulateFormValues;
  accumulateFieldErrors: AccumulateFormErrors;
  redeemValues: RedeemFormValues;
  redeemFieldErrors: RedeemFormErrors;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  transaction: TransactionResponse | null;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

const initialValues: AccumulateFormValues = {
  partnerCode: "",
  locationCode: "",
  amount: "",
  reference: "",
};

const initialRedeemValues: RedeemFormValues = {
  partnerCode: "",
  locationCode: "",
  points: "",
  reference: "",
};

function validateAccumulateForm(
  values: AccumulateFormValues,
): AccumulateFormErrors {
  const errors: AccumulateFormErrors = {};
  const amount = Number(values.amount);

  if (!values.partnerCode.trim()) {
    errors.partnerCode = "Ingresa el codigo del aliado.";
  }

  if (!values.locationCode.trim()) {
    errors.locationCode = "Ingresa el codigo de la sede.";
  }

  if (!values.amount.trim()) {
    errors.amount = "Ingresa el valor de la compra.";
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = "El valor debe ser mayor a cero.";
  }

  if (!values.reference.trim()) {
    errors.reference = "Ingresa la referencia de la compra.";
  } else if (values.reference.trim().length > 80) {
    errors.reference = "La referencia no debe superar 80 caracteres.";
  }

  return errors;
}

function validateRedeemForm(values: RedeemFormValues): RedeemFormErrors {
  const errors: RedeemFormErrors = {};
  const points = Number(values.points);

  if (!values.partnerCode.trim()) {
    errors.partnerCode = "Ingresa el codigo del aliado.";
  }

  if (!values.locationCode.trim()) {
    errors.locationCode = "Ingresa el codigo de la sede.";
  }

  if (!values.points.trim()) {
    errors.points = "Ingresa los puntos a redimir.";
  } else if (!Number.isInteger(points) || points <= 0) {
    errors.points = "Los puntos deben ser un entero mayor a cero.";
  }

  if (!values.reference.trim()) {
    errors.reference = "Ingresa la referencia de la redencion.";
  } else if (values.reference.trim().length > 80) {
    errors.reference = "La referencia no debe superar 80 caracteres.";
  }

  return errors;
}

function getTransactionErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as ApiErrorResponse;

    return data.message ?? data.error ?? "No pudimos procesar la transaccion.";
  }

  return "No pudimos procesar la transaccion. Intenta nuevamente.";
}

export function useTransaction() {
  const [state, setState] = useState<UseTransactionState>({
    accumulateValues: initialValues,
    accumulateFieldErrors: {},
    redeemValues: initialRedeemValues,
    redeemFieldErrors: {},
    isLoading: false,
    error: null,
    success: null,
    transaction: null,
  });

  function updateAccumulateField(
    field: keyof AccumulateFormValues,
    value: string,
  ) {
    setState((currentState) => ({
      ...currentState,
      accumulateValues: {
        ...currentState.accumulateValues,
        [field]: value,
      },
      accumulateFieldErrors: {
        ...currentState.accumulateFieldErrors,
        [field]: undefined,
      },
      error: null,
      success: null,
    }));
  }

  function updateRedeemField(field: keyof RedeemFormValues, value: string) {
    setState((currentState) => ({
      ...currentState,
      redeemValues: {
        ...currentState.redeemValues,
        [field]: value,
      },
      redeemFieldErrors: {
        ...currentState.redeemFieldErrors,
        [field]: undefined,
      },
      error: null,
      success: null,
    }));
  }

  async function accumulate(values: AccumulateFormValues) {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
      success: null,
      transaction: null,
    }));

    try {
      const authenticatedUser = await userService.getMe();

      if (!authenticatedUser.documentType || !authenticatedUser.documentNumber) {
        setState((currentState) => ({
          ...currentState,
          isLoading: false,
          error: "Tu perfil no tiene documento para acumular puntos.",
        }));
        return;
      }

      const transaction = await transactionService.accumulate({
        documentType: authenticatedUser.documentType,
        documentNumber: authenticatedUser.documentNumber,
        partnerCode: values.partnerCode.trim(),
        locationCode: values.locationCode.trim(),
        amount: Number(values.amount),
        reference: values.reference.trim(),
      });

      setState({
        accumulateValues: initialValues,
        accumulateFieldErrors: {},
        redeemValues: state.redeemValues,
        redeemFieldErrors: state.redeemFieldErrors,
        isLoading: false,
        error: null,
        success: transaction.message ?? "Puntos acumulados correctamente.",
        transaction,
      });
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        isLoading: false,
        error: getTransactionErrorMessage(error),
        success: null,
        transaction: null,
      }));
    }
  }

  async function redeem(values: RedeemFormValues) {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
      success: null,
      transaction: null,
    }));

    try {
      const authenticatedUser = await userService.getMe();

      if (!authenticatedUser.documentType || !authenticatedUser.documentNumber) {
        setState((currentState) => ({
          ...currentState,
          isLoading: false,
          error: "Tu perfil no tiene documento para redimir puntos.",
        }));
        return;
      }

      const transaction = await transactionService.redeem({
        documentType: authenticatedUser.documentType,
        documentNumber: authenticatedUser.documentNumber,
        partnerCode: values.partnerCode.trim(),
        locationCode: values.locationCode.trim(),
        points: Number(values.points),
        reference: values.reference.trim(),
      });

      setState({
        accumulateValues: state.accumulateValues,
        accumulateFieldErrors: state.accumulateFieldErrors,
        redeemValues: initialRedeemValues,
        redeemFieldErrors: {},
        isLoading: false,
        error: null,
        success: transaction.message ?? "Puntos redimidos correctamente.",
        transaction,
      });
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        isLoading: false,
        error: getTransactionErrorMessage(error),
        success: null,
        transaction: null,
      }));
    }
  }

  async function handleAccumulateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateAccumulateForm(state.accumulateValues);

    if (Object.keys(validationErrors).length > 0) {
      setState((currentState) => ({
        ...currentState,
        accumulateFieldErrors: validationErrors,
      }));
      return;
    }

    await accumulate(state.accumulateValues);
  }

  async function handleRedeemSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateRedeemForm(state.redeemValues);

    if (Object.keys(validationErrors).length > 0) {
      setState((currentState) => ({
        ...currentState,
        redeemFieldErrors: validationErrors,
      }));
      return;
    }

    await redeem(state.redeemValues);
  }

  return {
    accumulateValues: state.accumulateValues,
    accumulateFieldErrors: state.accumulateFieldErrors,
    redeemValues: state.redeemValues,
    redeemFieldErrors: state.redeemFieldErrors,
    isLoading: state.isLoading,
    error: state.error,
    success: state.success,
    transaction: state.transaction,
    updateAccumulateField,
    updateRedeemField,
    handleAccumulateSubmit,
    handleRedeemSubmit,
  };
}
