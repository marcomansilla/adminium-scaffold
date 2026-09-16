// Normalizes a date from format 'DD/MM/YYYY'
export const normalizeDate = (value) => {
  if (!value) return null;

  let day, month, year;

  // Caso Date
  if (value instanceof Date && !isNaN(value)) {
    year = value.getFullYear();
    month = value.getMonth() + 1;
    day = value.getDate();
  }

  // Caso string dd/mm/yyyy (con o sin hora)
  if (typeof value === 'string') {
    const [datePart] = value.trim().split(' ');
    const parts = datePart.split('/').map(Number);

    if (parts.length !== 3) return null;

    [day, month, year] = parts;
  }

  if (!day || !month || !year) return null;

  // Pad para formato ISO
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');

  return `${year}-${mm}-${dd}`;
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
};

export const formatUTC = (date, useUTC = true) =>  {
  const d = new Date(date);
  var result = '';

  if (useUTC) {
    // Use UTC methods to avoid timezone shifts
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const seconds = String(d.getUTCSeconds()).padStart(2, '0');

    result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else {
    // Use local timezone
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  return result;
};

export const toYMD = (dateStr) => dateStr.split('-').reverse().join('-');
