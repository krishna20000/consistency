"use client"

import { useState, useEffect } from 'react';

export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // Set the year only after mounting to the client to avoid hydration mismatches
    setYear(new Date().getFullYear());
  }, []);

  if (!year) return null;

  return <>{year}</>;
}
