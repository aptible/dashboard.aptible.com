export function fromNow(params, direction = 1) {
  let years = params.years || 0;
  let months = params.months || 0;
  let days = params.days || 0;
  let date = new Date();

  date.setYear(date.getFullYear() + (direction * years));
  date.setMonth(date.getMonth() + (direction * months));
  date.setDate(date.getDate() + (direction * days));

  return date;
}

export function ago(params) {
  return fromNow(params, -1);
}