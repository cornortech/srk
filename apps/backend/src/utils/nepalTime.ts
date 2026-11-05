// Nepal Standard Time is a fixed UTC+5:45 (no daylight saving)
const NPT_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

// Content submissions are only accepted inside this daily window (Nepal time)
export const SUBMISSION_OPEN_HOUR_NPT = 17;
export const SUBMISSION_WINDOW_HOURS = 1;

const pad = (n: number) => String(n).padStart(2, '0');

const formatHour = (hour24: number) => {
  const h = hour24 % 24;
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 === 0 ? 12 : h % 12}:00 ${suffix}`;
};

/** Nepal calendar date of an instant, as YYYY-MM-DD */
export const nptDayKey = (date: Date) => {
  const shifted = new Date(date.getTime() + NPT_OFFSET_MS);
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(
    shifted.getUTCDate()
  )}`;
};

/** UTC instant of 00:00 Nepal time on the given YYYY-MM-DD */
export const nptDayStart = (dayKey: string) => {
  const [y, m, d] = dayKey.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d) - NPT_OFFSET_MS);
};

export const getSubmissionWindow = (now = new Date()) => {
  const opensToday = new Date(
    nptDayStart(nptDayKey(now)).getTime() + SUBMISSION_OPEN_HOUR_NPT * HOUR_MS
  );
  const closesToday = new Date(
    opensToday.getTime() + SUBMISSION_WINDOW_HOURS * HOUR_MS
  );
  const isOpen = now >= opensToday && now < closesToday;
  const nextOpensAt =
    now < opensToday ? opensToday : new Date(opensToday.getTime() + 24 * HOUR_MS);

  return {
    isOpen,
    nextOpensAt,
    label: `${formatHour(SUBMISSION_OPEN_HOUR_NPT)} - ${formatHour(
      SUBMISSION_OPEN_HOUR_NPT + SUBMISSION_WINDOW_HOURS
    )} (Nepal time)`,
  };
};
