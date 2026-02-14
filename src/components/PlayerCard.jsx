import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trophy } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Simple time formatter for "Xm ago"
function formatTimeAgo(timestamp) {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'ora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m fa`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h fa`;
}

export default function PlayerCard({ player, isWinner, isSelected, onClick }) {
    const [showHistory, setShowHistory] = useState(false);

    return (
        <motion.div
            layout
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: isSelected ? 1.02 : 1,
                borderColor: isSelected ? '#10b981' : 'transparent'
            }}
            className={cn(
                "relative flex flex-col bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all cursor-pointer border-2 hover:bg-slate-700/80",
                isSelected ? "border-emerald-500 shadow-emerald-500/20" : "border-slate-700",
                isWinner && !isSelected ? "border-yellow-500/50" : ""
            )}
        >
            {/* Header: Name & Score */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                    <h3 className={cn(
                        "font-bold truncate text-sm uppercase tracking-wider",
                        isSelected ? "text-emerald-400" : "text-slate-400"
                    )}>
                        {player.name}
                    </h3>
                    {isWinner && (
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold mt-1">
                            <Trophy className="w-3 h-3" />
                            <span>L</span>
                        </div>
                    )}
                </div>

                <div className="flex items-baseline gap-1">
                    <motion.span
                        key={player.score}
                        initial={{ scale: 1.2, color: '#10b981' }}
                        animate={{ scale: 1, color: isSelected || isWinner ? '#fff' : '#e2e8f0' }}
                        className="text-4xl font-black tracking-tighter"
                    >
                        {player.score}
                    </motion.span>
                </div>
            </div>

            {/* History Toggle (Mini) */}
            <button
                onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }}
                className="w-full py-1.5 bg-black/20 hover:bg-black/40 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium transition-colors"
            >
                <History className="w-3 h-3" />
                {showHistory ? 'Nascondi' : 'Storia'}
            </button>

            {/* History List */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-black/40"
                    >
                        <div className="p-2 space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                            {player.history.length === 0 ? (
                                <p className="text-center text-[10px] text-slate-600 italic">Nessuna mossa</p>
                            ) : (
                                [...player.history].reverse().map((entry, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs border-b border-white/5 last:border-0 pb-1">
                                        <span className={entry.val > 0 ? "text-emerald-400" : "text-red-400"}>
                                            {entry.val > 0 ? `+${entry.val}` : entry.val}
                                        </span>
                                        <span className="text-slate-500 text-[10px]">
                                            {typeof entry === 'object' ? formatTimeAgo(entry.timestamp) : '-'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

PlayerCard.propTypes = {
    player: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.shape({
                    val: PropTypes.number.isRequired,
                    timestamp: PropTypes.number.isRequired
                })
            ])
        ).isRequired
    }).isRequired,
    isWinner: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};
