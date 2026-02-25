"use client"

import { useState, useEffect } from 'react';

export function HeaderDate() {
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    // This runs only on the client, ensuring the date matches the user's local timezone
    setDateStr(new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  // Return a placeholder of similar height during initial hydration to prevent layout shift
  if (!dateStr) return <div className="h-5" />;

  return (
    <p className="text-muted-foreground font-medium text-sm">
      {dateStr}
    </p>
  );
}
