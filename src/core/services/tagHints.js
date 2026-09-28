export const TAG_HINTS = {
  // Work
  کار: "work",
  شرکت: "work",
  پروژه: "work",
  مشتری: "work",
  جلسه: "work",
  گزارش: "work",
  ایمیل: "work",
  report: "work",
  meeting: "work",
  project: "work",

  // Home
  خانه: "home",
  خونه: "home",
  خرید: "home",
  نظافت: "home",
  آشپزی: "home",
  ظرف: "home",
  لباس: "home",
  home: "home",
  grocery: "home",
  clean: "home",

  // Study
  درس: "study",
  دانشگاه: "study",
  مطالعه: "study",
  کتاب: "study",
  امتحان: "study",
  تکلیف: "study",
  تمرین: "study",
  study: "study",
  exam: "study",
  homework: "study",

  // Health
  ورزش: "health",
  باشگاه: "health",
  پیاده‌روی: "health",
  دویدن: "health",
  دکتر: "health",
  دارو: "health",
  gym: "health",
  workout: "health",
  doctor: "health",

  // Family
  خانواده: "family",
  مامان: "family",
  بابا: "family",
  خواهر: "family",
  برادر: "family",
  تولد: "family",
  family: "family",
  birthday: "family",
};

export function inferTags(text, existingTags = []) {
  const lower = text.toLowerCase();
  const found = new Set();

  for (const [keyword, tag] of Object.entries(TAG_HINTS)) {
    if (lower.includes(keyword.toLowerCase())) {
      found.add(tag);
    }
  }

  return [...found];
}
