"use client";

import React, { useState, useEffect } from "react";

interface FlashSaleTimerProps {
  endDate: string;
}

export function FlashSaleTimer({ endDate }: FlashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1 font-mono font-bold text-sm">
      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded">{pad(timeLeft.hours)}</span>
      <span className="text-red-500">:</span>
      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded">{pad(timeLeft.minutes)}</span>
      <span className="text-red-500">:</span>
      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded">{pad(timeLeft.seconds)}</span>
    </div>
  );
}
