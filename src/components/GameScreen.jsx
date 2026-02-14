import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Check, Trophy, BarChart3, RotateCcw, Share2 } from 'lucide-react';
import PlayerCard from './PlayerCard';
import Leaderboard from './Leaderboard';
import QRCodeModal from './QRCodeModal';
import GameTimer from './GameTimer';
import PropTypes from 'prop-types';
import logo from '../assets/logo.jpeg';
import clsx from 'clsx';
import pkg from '../../package.json';

export default function GameScreen({ players, gameStartTime, onUpdateScore, onRollbackScore, onUndoSingleEntry, onSetWinner, onResetGame, onRestartMatch }) {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [customScore, setCustomScore] = useState('');
    const customInputRef = useRef(null);

    const manualWinnerExists = players.some(p => p.manualWinner);
    const maxScore = Math.max(...players.map(p => p.score), 0);

    // Winner logic: Manual overrides score.
    const isPlayerWinner = (player) => {
        if (manualWinnerExists) return player.manualWinner;
        return player.score > 0 && player.score === maxScore;
    };

    const selectedPlayer = players.find(p => p.id === selectedPlayerId);

    // Auto-focus input when player selected
    useEffect(() => {
        if (selectedPlayerId && customInputRef.current) {
            // Small delay to allow UI transition
            setTimeout(() => customInputRef.current?.focus(), 50);
        }
    }, [selectedPlayerId]);

    // Filter out players who are manually selected as winners
    const visiblePlayers = players.filter(p => !p.manualWinner);

    // Deselect player if they become a winner (hidden from grid)
    useEffect(() => {
        if (selectedPlayerId) {
            const player = players.find(p => p.id === selectedPlayerId);
            if (player && player.manualWinner) {
                setSelectedPlayerId(null);
            }
        }
    }, [players, selectedPlayerId]);

    const handleCustomScoreSubmit = (e) => {
        e.preventDefault();
        if (!selectedPlayerId) return;

        const val = parseFloat(customScore);
        if (!isNaN(val) && val !== 0) {
            onUpdateScore(selectedPlayerId, val);
            setCustomScore('');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-neutral-900 text-white overflow-hidden">
            {/* Header - Fixed top */}
            <div className="flex-none p-4 bg-neutral-900/90 backdrop-blur-md z-10 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-10 h-10 rounded-full overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-colors active:scale-95 flex-shrink-0"
                        title="Ricarica pagina"
                    >
                        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                    </button>
                    <GameTimer startTime={gameStartTime} />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowQR(true)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        title="Condividi"
                    >
                        <Share2 className="w-5 h-5 text-violet-400" />
                    </button>
                    <button
                        onClick={() => setShowLeaderboard(true)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        title="Classifica"
                    >
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                    </button>
                    <button
                        onClick={onRestartMatch}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        title="Reset Punteggi"
                    >
                        <RotateCcw className="w-5 h-5 text-blue-400" />
                    </button>
                    <button
                        onClick={onResetGame}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        title="Esci"
                    >
                        <ArrowLeft className="w-5 h-5 text-red-400" />
                    </button>
                </div>
            </div>

            {/* Main Content - Scrollable Grid */}
            <div className="flex-1 overflow-y-auto p-4 pb-32">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {visiblePlayers.map((player) => (
                        <PlayerCard
                            key={player.id}
                            player={player}
                            isWinner={isPlayerWinner(player)}
                            isSelected={selectedPlayerId === player.id}
                            onClick={() => setSelectedPlayerId(player.id === selectedPlayerId ? null : player.id)}
                            onRollback={(historyIndex) => onRollbackScore(player.id, historyIndex)}
                            onUndoSingle={(historyIndex) => onUndoSingleEntry(player.id, historyIndex)}
                        />
                    ))}
                </div>
            </div>

            {/* Sticky Footer - Controls */}
            <div className="flex-none bg-neutral-800 border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <div className="max-w-xl mx-auto p-4">
                    {!selectedPlayer || selectedPlayer.manualWinner ? (
                        <div className="h-20 flex items-center justify-center text-white/30 text-sm font-medium animate-pulse">
                            Seleziona un giocatore per modificare il punteggio
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Selected Player Indicator (Optional, confirms selection) */}
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                <span className="text-emerald-400">Modifica: {selectedPlayer.name} ({Number(selectedPlayer.score.toFixed(2))})</span>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => onSetWinner(selectedPlayer.id)}
                                        className={clsx(
                                            "flex items-center gap-1 transition-colors",
                                            selectedPlayer.manualWinner ? "text-yellow-400" : "text-slate-500 hover:text-yellow-300"
                                        )}
                                    >
                                        <Trophy className="w-4 h-4" />
                                        {selectedPlayer.manualWinner ? "Vincitore" : "Assegna Vittoria"}
                                    </button>
                                    <button onClick={() => setSelectedPlayerId(null)} className="text-white/40 hover:text-white">Chiudi</button>
                                </div>
                            </div>

                            {/* Quick Actions Grid */}
                            <div className="grid grid-cols-6 gap-2">
                                {/* Negative */}
                                <button
                                    disabled={selectedPlayer.manualWinner}
                                    onClick={() => onUpdateScore(selectedPlayer.id, -1)}
                                    className="col-span-2 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-red-500 font-bold text-xl flex items-center justify-center transition-colors border border-red-500/20 active:scale-95"
                                >
                                    -1
                                </button>
                                <button
                                    disabled={selectedPlayer.manualWinner}
                                    onClick={() => onUpdateScore(selectedPlayer.id, -11)}
                                    className="col-span-2 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-red-500 font-bold text-xl flex items-center justify-center transition-colors border border-red-500/20 active:scale-95"
                                >
                                    -11
                                </button>
                                <button
                                    disabled={selectedPlayer.manualWinner}
                                    onClick={() => onUpdateScore(selectedPlayer.id, -12)}
                                    className="col-span-2 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-red-500 font-bold text-xl flex items-center justify-center transition-colors border border-red-500/20 active:scale-95"
                                >
                                    -12
                                </button>
                            </div>

                            {/* Custom Input */}
                            <form onSubmit={handleCustomScoreSubmit} className="flex gap-2">
                                <input
                                    ref={customInputRef}
                                    type="number"
                                    step="any"
                                    disabled={selectedPlayer.manualWinner}
                                    value={customScore}
                                    onChange={(e) => setCustomScore(e.target.value)}
                                    placeholder={selectedPlayer.manualWinner ? "Punteggio bloccato" : "Altro..."}
                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 text-center font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-white/20 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="submit"
                                    disabled={!customScore || selectedPlayer.manualWinner}
                                    className="w-12 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-green-400"
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Leaderboard Overlay */}
            <Leaderboard
                players={players}
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
                onToggleWinner={onSetWinner}
            />
            <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} />
            {/* Version Footer */}
            <div className="absolute bottom-1 right-1 text-white/10 text-[10px] font-mono select-none z-50 pointer-events-none">
                v{pkg.version}
            </div>
        </div>
    );
}

GameScreen.propTypes = {
    players: PropTypes.array.isRequired,
    gameStartTime: PropTypes.number,
    onUpdateScore: PropTypes.func.isRequired,
    onRollbackScore: PropTypes.func.isRequired,
    onUndoSingleEntry: PropTypes.func.isRequired,
    onSetWinner: PropTypes.func.isRequired,
    onResetGame: PropTypes.func.isRequired,
    onRestartMatch: PropTypes.func.isRequired
};
