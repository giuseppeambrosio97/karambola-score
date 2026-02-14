import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Leaderboard({ players, isOpen, onClose }) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

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

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-x-4 top-[10%] max-w-md mx-auto z-50 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                <h2 className="text-xl font-bold text-white">Classifica</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="p-4 overflow-y-auto flex-1 space-y-2">
                            <AnimatePresence mode="popLayout">
                                {sortedPlayers.map((player, index) => (
                                    <motion.div
                                        layout
                                        key={player.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                                            index === 0 ? "bg-yellow-500/10 border-yellow-500/50" :
                                                index === 1 ? "bg-slate-300/10 border-slate-300/50" :
                                                    index === 2 ? "bg-amber-700/10 border-amber-700/50" :
                                                        "bg-white/5 border-white/10"
                                        )}
                                    >
                                        {/* Rank */}
                                        <div className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm",
                                            index === 0 ? "bg-yellow-500 text-yellow-950" :
                                                index === 1 ? "bg-slate-300 text-slate-900" :
                                                    index === 2 ? "bg-amber-700 text-amber-100" :
                                                        "bg-slate-700 text-slate-300"
                                        )}>
                                            {index + 1}
                                        </div>

                                        {/* Name */}
                                        <div className="flex-1 font-medium text-white truncate flex items-center gap-2">
                                            {player.name}
                                            {index === 0 && <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider">TI ROMPO</span>}
                                            {index === sortedPlayers.length - 1 && sortedPlayers.length > 1 && <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">CASSA 💸</span>}
                                        </div>

                                        {/* Score */}
                                        <motion.div
                                            key={player.score}
                                            initial={{ scale: 1.5, color: '#10b981' }}
                                            animate={{ scale: 1, color: '#fff' }}
                                            className="text-xl font-black font-mono"
                                        >
                                            {player.score}
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

Leaderboard.propTypes = {
    players: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired
    })).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};
