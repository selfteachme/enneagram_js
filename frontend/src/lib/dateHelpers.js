import {
  addHours,
  differenceInHours,
  format,
  formatISO,
  parseISO,
} from "date-fns";

function inOneHour() {
  let expireDate = addHours(new Date(), 1);
  expireDate = formatISO(expireDate);
  return expireDate;
}

function happenedWithinTheHour(expiryTime) {
  const now = new Date();
  const earlier = parseISO(expiryTime);
  const difference = differenceInHours(now, earlier);
  if (difference < 1) return true;
  else return false;
}

export { happenedWithinTheHour, inOneHour };
