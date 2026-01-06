// Normalizes a date in format 'DD/MM/YYYY'
export const normalizeDate = (value) => {
  if (!value) return null;

  if (value instanceof Date && !isNaN(value)) {
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

// Translates JS date object to DD/MM/YYYY
export const convertDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return null;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Adds N days to date
export const modifyDate = (value, days, operacion = "add") => {
  if (!value || typeof value !== "string") return null;

  const [day, month, year] = value.split('/').map(Number);
  if (!day || !month || !year) return null;

  const date = new Date(year, month - 1, day);
  if (isNaN(date)) return null;

  date.setDate(date.getDate() + (operacion === "add" ? days : -days));

  return convertDate(date);
};


export const xignus_locale =  {
  /* starting with Sunday */
  days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: 'dias'
}
