// get the date of last sunday
export function getSunday() {
    const today = new Date();
    const diff = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - diff);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  }

// capitalize the first letter of a string
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// convert a date to a string
export function dateToString (date) {
  if (!date) {
    return null;
  }
  const year = date.getFullYear ();
  const month = date.getMonth () + 1;
  const day = date.getDate ();
  return `${year}-${month}-${day}`;
}

// convert a time to a string
export function timeToString (time) {
  if (!time) {
    return null;
  }
  const hours = time.getHours () < 10 ? `0${time.getHours ()}` : time.getHours ();
  const minutes = time.getMinutes () < 10 ? `0${time.getMinutes ()}` : time.getMinutes ();
  return `${hours}:${minutes}`;
}

// convert a string to a date
export function stringToDate (dateString) {
  const [year, month, day] = dateString.split ('-');
  return new Date (year, month - 1, day);
}

// convert a string to a time
export function stringToTime (timeString) {
  const [hours, minutes] = timeString.split (':');
  const time = new Date ();
  time.setHours (hours, minutes);
  return time;
}