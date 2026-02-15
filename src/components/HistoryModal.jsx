import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Undo2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

function formatTimeAgo(timestamp) {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'ora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m fa`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h fa`;
}

export default function HistoryModal({ player, isOpen, onClose, onRollback, onUndoSingle }) {
    if (!player) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                    />

                    {/* Modal - Full height slide-up */}
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 top-[8%] z-50 bg-slate-800 rounded-t-3xl border-t border-slate-700 shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex-none p-4 border-b border-slate-700 bg-slate-900/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <History className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-lg font-bold text-white truncate">{player.name}</h2>
                                        <p className="text-sm text-emerald-400 font-mono font-bold">
                                            Punteggio: {Number(player.score.toFixed(2))}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white flex-shrink-0"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Summary bar */}
                            <div className="flex gap-4 mt-3 text-xs text-slate-500">
                                <span>{player.history.length} movimenti</span>
                                {player.history.length > 0 && (
                                    <>
                                        <span>
                                            Ultimo: {formatTimeAgo(player.history[player.history.length - 1]?.timestamp)}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* History List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {player.history.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                    <History className="w-12 h-12 mb-3 opacity-30" />
                                    <p className="text-sm font-medium">Nessun punto assegnato.</p>
                                    <p className="text-xs mt-1">I movimenti appariranno qui.</p>
                                </div>
                            ) : (
                                [...player.history].reverse().map((entry, reversedIndex) => {
                                    const originalIndex = player.history.length - 1 - reversedIndex;
                                    const scoreAfter = entry.scoreAfter != null
                                        ? Number(entry.scoreAfter.toFixed(2))
                                        : '?';

                                    return (
                                        <motion.div
                                            key={`${originalIndex}-${entry.timestamp}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: reversedIndex * 0.02 }}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-white/5"
                                        >
                                            {/* Index badge */}
                                            <span className="text-[10px] text-slate-600 font-mono w-6 text-center flex-shrink-0">
                                                #{originalIndex + 1}
                                            </span>

                                            {/* Delta */}
                                            <span className={cn(
                                                "font-bold text-lg min-w-[50px]",
                                                entry.val > 0 ? "text-emerald-400" : "text-red-400"
                                            )}>
                                                {entry.val > 0 ? `+${entry.val}` : entry.val}
                                            </span>

                                            {/* Score after */}
                                            <span className="text-slate-400 text-sm font-mono">
                                                → {scoreAfter}
                                            </span>

                                            {/* Spacer */}
                                            <span className="flex-1" />

                                            {/* Time ago */}
                                            <span className="text-slate-500 text-xs flex-shrink-0">
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
                                                className="p-1.5 rounded-lg hover:bg-orange-500/20 text-slate-500 hover:text-orange-400 transition-colors flex-shrink-0"
                                                title="Annulla solo questa"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            {/* Rollback from here */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`Annullare questa mossa e tutte le successive?`)) {
                                                        onRollback(originalIndex);
                                                    }
                                                }}
                                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                                                title="Annulla da qui"
                                            >
                                                <Undo2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

HistoryModal.propTypes = {
    player: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
        history: PropTypes.array.isRequired
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onRollback: PropTypes.func.isRequired,
    onUndoSingle: PropTypes.func.isRequired
};
