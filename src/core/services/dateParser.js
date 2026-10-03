const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function normalizeDigits(str) {
  return str
    .replace(/[۰-۹]/g, (d) => FA_DIGITS.indexOf(d))
    .replace(/[٠-٩]/g, (d) => AR_DIGITS.indexOf(d));
}

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function nextWeekday(from, targetDay) {
  const d = new Date(from);
  const diff = (targetDay - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
}

function getDateRules() {
  const today = startOfDay(new Date());

  return {
    امروز: () => today,
    فردا: () => addDays(today, 1),
    پس‌فردا: () => addDays(today, 2),
    "پس فردا": () => addDays(today, 2),
    today: () => today,
    tomorrow: () => addDays(today, 1),
    "day after tomorrow": () => addDays(today, 2),
    "هفته بعد": () => addDays(today, 7),
    "هفته آینده": () => addDays(today, 7),
    "next week": () => addDays(today, 7),
    "آخر هفته": () => nextWeekday(today, 5),
    weekend: () => nextWeekday(today, 5),
  };
}

const WEEKDAYS_FA = {
  یکشنبه: 0,
  دوشنبه: 1,
  سه‌شنبه: 2,
  "سه شنبه": 2,
  چهارشنبه: 3,
  پنجشنبه: 4,
  پنج‌شنبه: 4,
  جمعه: 5,
  شنبه: 6,
};

const WEEKDAYS_EN = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function extractDate(text) {
  const normalized = normalizeDigits(text).toLowerCase();

  const rules = getDateRules();
  for (const [key, fn] of Object.entries(rules)) {
    if (normalized.includes(key)) {
      return { date: toISO(fn()), matchedText: key };
    }
  }

  for (const [name, day] of Object.entries(WEEKDAYS_FA)) {
    if (normalized.includes(name)) {
      const next = nextWeekday(startOfDay(new Date()), day);
      return { date: toISO(next), matchedText: name };
    }
  }

  for (const [name, day] of Object.entries(WEEKDAYS_EN)) {
    const regex = new RegExp(`\\b${name}\\b`, "i");
    if (regex.test(normalized)) {
      const next = nextWeekday(startOfDay(new Date()), day);
      return { date: toISO(next), matchedText: name };
    }
  }

  const explicit = normalized.match(
    /\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/,
  );
  if (explicit) {
    const [, y, m, d] = explicit;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return { date: toISO(date), matchedText: explicit[0] };
  }

  return { date: null, matchedText: null };
}

export function extractTime(text) {
  const normalized = normalizeDigits(text).toLowerCase();

  const withPeriod = normalized.match(
    /(?:ساعت\s*)?(\d{1,2})(?:[:.](\d{1,2}))?\s*(صبح|بامداد|ظهر|عصر|شب|am|pm)/,
  );
  if (withPeriod) {
    let h = Number(withPeriod[1]);
    const m = Number(withPeriod[2] || 0);
    const period = withPeriod[3];

    if (["عصر", "شب", "pm"].includes(period) && h < 12) h += 12;
    if (["صبح", "بامداد", "am"].includes(period) && h === 12) h = 0;

    return {
      time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      matchedText: withPeriod[0],
      period,
      ambiguous: false,
    };
  }

  const faTime = normalized.match(/ساعت\s*(\d{1,2})(?:[:.](\d{1,2}))?/);
  if (faTime) {
    const h = Number(faTime[1]);
    const m = Number(faTime[2] || 0);
    const isAmbiguous = h >= 1 && h <= 11;

    return {
      time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      matchedText: faTime[0],
      period: null,
      ambiguous: isAmbiguous,
    };
  }

  const colon = normalized.match(/\b(\d{1,2}):(\d{2})\b/);
  if (colon) {
    const h = Number(colon[1]);
    const m = Number(colon[2]);
    const isAmbiguous = h >= 1 && h <= 11;
    return {
      time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      matchedText: colon[0],
      period: null,
      ambiguous: isAmbiguous,
    };
  }

  const ampm = normalized.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (ampm) {
    let h = Number(ampm[1]);
    const m = Number(ampm[2] || 0);
    const period = ampm[3];
    if (period === "pm" && h < 12) h += 12;
    if (period === "am" && h === 12) h = 0;
    return {
      time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      matchedText: ampm[0],
      period,
      ambiguous: false,
    };
  }

  return { time: null, matchedText: null, period: null, ambiguous: false };
}
