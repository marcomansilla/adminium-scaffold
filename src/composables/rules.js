// validators/rules.js
export const required = (value) => (!value ? 'Este dato es requerido.' : null);

export const email = (value) =>
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? 'Direccion de E-mail invalida.'
    : null;

export const minLength = (min) => (value) =>
  value && value.length < min
    ? `Debe ingresar al menos ${min} caracteres.`
    : null;

export const sameAs = (otherField) => (value, fields) =>
  value !== fields[otherField] ? 'Los campos no coinciden.' : null;

export const requiredIf =
  (otherField, otherFieldName, conditionValue) => (value, fields) => {
    // Si el otro campo cumple con el valor especificado, valida el campo actual
    if (fields[otherField] === conditionValue) {
      return !value
  ? `Este dato es requerido si ${otherFieldName} es ${conditionValue}.`
  : null;
    }
    // Si no se cumple la condición, no se aplica la validación
    return null;
  };

export const maxLength = (max) => (value) =>
  value && value.length > max
    ? `Debe ingresar como máximo ${max} caracteres.`
    : null;

// Convierte DD/MM/YYYY o Date a un objeto Date en UTC con hora 00:00:00
const normalizeDate = (value) => {
  if (!value) return null;

  if (value instanceof Date && !isNaN(value)) {
    // Si ya es un objeto Date válido, normalizamos la hora
    value.setUTCHours(0, 0, 0, 0);
    return value;
  }

  if (typeof value === "string") {
    const [day, month, year] = value.split('/').map(Number);
    if (!day || !month || !year) return null;
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  }

  return null;
};

// Valida que la fecha ingresada sea igual o posterior a minDate
export const minDate = (min) => (value) => {
  const inputDate = normalizeDate(value);
  const minAllowed = normalizeDate(min);

  if (!inputDate || !minAllowed) return `Fecha inválida.`;

  return inputDate < minAllowed ? `La fecha debe ser posterior o igual a ${min}.` : null;
};

// Valida que la fecha ingresada sea igual o anterior a maxDate
export const maxDate = (max) => (value) => {
  const inputDate = normalizeDate(value);
  const maxAllowed = normalizeDate(max);

  if (!inputDate || !maxAllowed) return `Fecha inválida.`;

  return inputDate > maxAllowed ? `La fecha debe ser anterior o igual a ${max}.` : null;
};

// Valida que la fecha esté en un rango entre minDate y maxDate
export const dateRange = (min, max) => (value) => {
  const inputDate = normalizeDate(value);
  const minAllowed = normalizeDate(min);
  const maxAllowed = normalizeDate(max);

  if (!inputDate || !minAllowed || !maxAllowed) return `Fecha inválida.`;

  return inputDate < minAllowed || inputDate > maxAllowed
    ? `La fecha debe estar entre ${min} y ${max}.`
    : null;
};
