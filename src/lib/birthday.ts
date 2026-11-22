import { site } from '../config/site';

const TZ = site.birthday.timezone;

export type WallClock = {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export type CountdownState = {
  mode: 'countdown' | 'birthday';
  /** Whole days remaining (countdown mode). */
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Nairobi calendar year the next celebration belongs to. */
  year: number;
  /** Epoch milliseconds of the next December 5th, 00:00 Nairobi. */
  target: number;
  /** True when the next celebration is later today / imminent. */
  isToday: boolean;
};

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

/** Wall-clock time in Africa/Nairobi for a given instant. */
export function nairobiParts(date: Date = new Date()): WallClock {
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  // en-GB can render midnight as 24 in some engines; normalise.
  const hour = get('hour') % 24;
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour,
    minute: get('minute'),
    second: get('second'),
  };
}

/** Convert an Africa/Nairobi wall-clock time to an epoch timestamp. */
export function nairobiEpoch(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
): number {
  const guess = Date.UTC(year, month - 1, day, hour, minute, second);
  const wall = nairobiParts(new Date(guess));
  const rendered = Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
    wall.second
  );
  return guess - (rendered - guess);
}

/**
 * The next December 5th in Africa/Nairobi.
 * - Before 5 Dec: this year's birthday.
 * - On 5 Dec: birthday mode all day.
 * - After 5 Dec: next year's birthday.
 */
export function getCountdownState(now: Date = new Date()): CountdownState {
  const wall = nairobiParts(now);
  const birthdayMonth = site.birthday.month;
  const birthdayDay = site.birthday.day;

  const isBeforeToday =
    wall.month < birthdayMonth || (wall.month === birthdayMonth && wall.day < birthdayDay);
  const isBirthday = wall.month === birthdayMonth && wall.day === birthdayDay;

  const targetYear = isBeforeToday || isBirthday ? wall.year : wall.year + 1;
  const target = nairobiEpoch(targetYear, birthdayMonth, birthdayDay);

  if (isBirthday) {
    const endOfDay = nairobiEpoch(targetYear, birthdayMonth, birthdayDay + 1);
    const remaining = Math.max(0, endOfDay - now.getTime());
    return {
      mode: 'birthday',
      days: 0,
      hours: Math.floor(remaining / 3_600_000),
      minutes: Math.floor((remaining % 3_600_000) / 60_000),
      seconds: Math.floor((remaining % 60_000) / 1000),
      year: targetYear,
      target,
      isToday: true,
    };
  }

  const diff = Math.max(0, target - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    mode: 'countdown',
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    year: targetYear,
    target,
    isToday: totalSeconds < 86400,
  };
}

export const pad = (value: number) => String(value).padStart(2, '0');

export const formatLongDate = (timestamp: number) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(timestamp));
