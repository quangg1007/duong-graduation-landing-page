import React from 'react';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type Props = {
  timeLeft: TimeLeft;
};

const CountdownSection = ({ timeLeft }: Props) => {
  const countdownItems = [
    { label: 'Ngày', val: timeLeft.days },
    { label: 'Giờ', val: timeLeft.hours },
    { label: 'Phút', val: timeLeft.minutes },
    { label: 'Giây', val: timeLeft.seconds },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8">
          {countdownItems.map((item) => (
            <div key={item.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center group hover:border-red-500 transition-colors">
              <div className="text-4xl md:text-6xl font-bold text-slate-900 mb-1">{String(item.val).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
