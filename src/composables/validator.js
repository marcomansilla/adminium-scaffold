import { useFormValidatorStore } from '../stores/UseFormValidator.js';

export function useValidator() {
  const store = useFormValidatorStore();

  const Errors = store.formErrors;

  const initializeErrors = (formname) => {
    store.initializeFormValidator(formname);
  };

  const validate = (formname, fields, rules) => {
    store.checkFormErrors(formname, fields, rules);
  };

  const clearError = (formname, field) => {
    store.clearFormError(formname, field);
  };

  const injectError = (formname, field, text) => {
    store.injectError(formname, field, text)
  }

  const clearAllFormErrors = (formname) => {
    store.clearAllFormErrors(formname);
  }
  return {
    Errors,
    validate,
    initializeErrors,
    clearError,
    clearAllFormErrors,
    injectError
  };
}
