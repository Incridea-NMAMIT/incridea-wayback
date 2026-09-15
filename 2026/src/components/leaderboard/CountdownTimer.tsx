import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

const TARGET_DATE = new Date("2026-03-08T18:00:00+05:30");

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +TARGET_DATE - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) return null;

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="relative">
                <div className="absolute inset-0 bg-purple-500 rounded-lg blur-xl opacity-20 transform scale-150"></div>
                <span className="relative text-2xl sm:text-3xl md:text-5xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {value.toString().padStart(2, '0')}
                </span>
            </div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">{label}</span>
        </div>
    );

    const Separator = () => (
        <div className="relative mb-4 sm:mb-6">
            <span className="text-xl md:text-3xl font-black text-gray-600/50 animate-pulse">:</span>
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-2 mb-2 sm:mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-gray-500/50"></div>
                <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-gray-400 font-bold whitespace-nowrap">
                    Final winner to be decided in
                </h2>
                <div className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-gray-500/50"></div>
            </div>

            <div className="flex items-center gap-4 sm:gap-12 md:gap-16">
                <TimeBlock value={timeLeft.days} label="Days" />
                <Separator />
                <TimeBlock value={timeLeft.hours} label="Hours" />
                <Separator />
                <TimeBlock value={timeLeft.minutes} label="Minutes" />
                <Separator />
                <TimeBlock value={timeLeft.seconds} label="Seconds" />
            </div>

            <p className="text-[10px] sm:text-xs text-white mt-1 flex items-center gap-1.5 opacity-70">
                Click on <Info size={14} className="inline-block" /> button to see the prizes
            </p>
        </div>
    );
};

export default CountdownTimer;
