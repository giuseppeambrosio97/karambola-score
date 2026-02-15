import { motion } from 'framer-motion';
import { History, Trophy } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function PlayerCard({ player, isWinner, isSelected, onClick, onOpenHistory }) {
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
                "relative flex flex-col justify-between bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all cursor-pointer border-2 hover:bg-slate-700/80",
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

            {/* History Toggle (Mini) - Now triggers Modal */}
            <button
                onClick={(e) => { e.stopPropagation(); onOpenHistory(); }}
                className="w-full py-1.5 bg-black/20 hover:bg-black/40 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium transition-colors"
            >
                <History className="w-3 h-3" />
                Storia
            </button>
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
    onOpenHistory: PropTypes.func.isRequired
};
