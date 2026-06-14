import { useEffect, useState } from 'react';

const LOCATIONS = [
  { label: 'seattle', timeZone: 'America/Los_Angeles' },
  { label: 'bangkok', timeZone: 'Asia/Bangkok' },
  { label: 'manila', timeZone: 'Asia/Manila' },
];

function formatClockTime(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  })
    .format(date)
    .toLowerCase();
}

function buildClockLabel(date) {
  return LOCATIONS.map(({ label, timeZone }) => {
    const time = formatClockTime(date, timeZone);
    return `${time} ${label}`;
  }).join(' | ');
}

export function useWorldClocks() {
  const [label, setLabel] = useState(() => buildClockLabel(new Date()));

  useEffect(() => {
    const update = () => setLabel(buildClockLabel(new Date()));
    update();

    const now = new Date();
    const msUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId;

    const timeoutId = window.setTimeout(() => {
      update();
      intervalId = window.setInterval(update, 60_000);
    }, msUntilNextMinute);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  return label;
}
