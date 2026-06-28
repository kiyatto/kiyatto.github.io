import { useEffect, useState } from 'react';

const LOCATIONS = [
  { label: 'seattle', timeZone: 'America/Los_Angeles' },
  { label: 'bangkok', timeZone: 'Asia/Bangkok' },
  { label: 'manila', timeZone: 'Asia/Manila' },
];

function buildClocks(date) {
  return LOCATIONS.map(({ label, timeZone }) => {
    const formatted = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone,
    }).format(date).toLowerCase();

    // get the hour in that timezone to determine sun/moon
    const hour = parseInt(
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone,
      }).format(date),
      10
    );

    const isNight = hour >= 18 || hour < 5;

    return { label, time: formatted, isNight };
  });
}

export function useWorldClocks() {
  const [clocks, setClocks] = useState(() => buildClocks(new Date()));

  useEffect(() => {
    const update = () => setClocks(buildClocks(new Date()));
    update();

    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
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

  return clocks;
}