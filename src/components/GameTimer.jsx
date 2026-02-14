import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import PropTypes from 'prop-types';

export default function GameTimer({ startTime }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!startTime) return;

        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-600/50">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-emerald-100 font-medium tracking-wider">
                {formatTime(elapsed)}
            </span>
        </div>
    );
}

GameTimer.propTypes = {
    startTime: PropTypes.number
};
