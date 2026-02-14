import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trophy, Undo2, X } from 'lucide-react';
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

export default function PlayerCard({ player, isWinner, isSelected, onClick, onRollback, onUndoSingle }) {
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
                        {Number(player.score.toFixed(2))}
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
                        <div className="p-2 space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                            {player.history.length === 0 ? (
                                <p className="text-center text-[10px] text-slate-600 italic">Nessun punto.</p>
                            ) : (
                                [...player.history].reverse().map((entry, reversedIndex) => {
                                    const originalIndex = player.history.length - 1 - reversedIndex;
                                    const scoreAfter = entry.scoreAfter != null
                                        ? Number(entry.scoreAfter.toFixed(2))
                                        : '?';

                                    return (
                                        <div key={reversedIndex} className="flex items-center gap-2 text-xs border-b border-white/5 last:border-0 pb-1">
                                            {/* Delta */}
                                            <span className={cn(
                                                "font-semibold min-w-[36px]",
                                                entry.val > 0 ? "text-emerald-400" : "text-red-400"
                                            )}>
                                                {entry.val > 0 ? `+${entry.val}` : entry.val}
                                            </span>

                                            {/* Score after */}
                                            <span className="text-slate-400 text-[10px] font-mono">
                                                → {scoreAfter}
                                            </span>

                                            {/* Spacer */}
                                            <span className="flex-1" />

                                            {/* Time ago */}
                                            <span className="text-slate-600 text-[10px]">
                                                {typeof entry === 'object' ? formatTimeAgo(entry.timestamp) : '-'}
                                            </span>

                                            {/* Undo single entry */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`Annullare solo questa mossa (${entry.val > 0 ? '+' : ''}${entry.val})?`)) {
                                                        onUndoSingle(originalIndex);
                                                    }
                                                }}
                                                className="p-0.5 rounded hover:bg-orange-500/20 text-slate-600 hover:text-orange-400 transition-colors"
                                                title="Annulla solo questa"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>

                                            {/* Rollback from here */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`Annullare questa mossa e tutte le successive?`)) {
                                                        onRollback(originalIndex);
                                                    }
                                                }}
                                                className="p-0.5 rounded hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-colors"
                                                title="Annulla da qui"
                                            >
                                                <Undo2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    );
                                })
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
                    scoreAfter: PropTypes.number,
                    timestamp: PropTypes.number.isRequired
                })
            ])
        ).isRequired
    }).isRequired,
    isWinner: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onRollback: PropTypes.func.isRequired,
    onUndoSingle: PropTypes.func.isRequired
};
