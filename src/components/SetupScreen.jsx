import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import logo from '../assets/logo.jpeg';
import pkg from '../../package.json';

export default function SetupScreen({ onStartGame }) {
    const [step, setStep] = useState(1);
    const [numPlayers, setNumPlayers] = useState(null);
    const [customNum, setCustomNum] = useState(''); // New state for custom input
    const [players, setPlayers] = useState([]);
    const inputRefs = useRef([]);

    // Initialize players array when numPlayers is selected
    useEffect(() => {
        if (numPlayers) {
            setPlayers(Array.from({ length: numPlayers }, (_, i) => ({
                id: i + 1,
                name: '',
                score: 0,
                history: [],
                manualWinner: false
            })));
        }
    }, [numPlayers]);

    // Auto-focus logic
    useEffect(() => {
        if (step === 2 && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [step]);

    const handlePlayerNameChange = (index, name) => {
        const newPlayers = [...players];
        newPlayers[index].name = name;
        setPlayers(newPlayers);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index < numPlayers - 1) {
                inputRefs.current[index + 1]?.focus();
            } else {
                handleStartGame();
            }
        }
    };

    const handleStartGame = () => {
        // Validation: Ensure all names are filled (or provide defaults)
        const initializedPlayers = players.map((p, i) => ({
            ...p,
            name: p.name.trim() || `Giocatore ${i + 1}`
        }));
        onStartGame(initializedPlayers);
    };

    const handleCustomNumSubmit = (e) => {
        e.preventDefault();
        const val = parseInt(customNum);
        if (val > 0) {
            setNumPlayers(val);
            setStep(2);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 relative">
            {/* Version Footer */}
            <div className="absolute bottom-2 right-2 text-neutral-600 text-[10px] font-mono select-none">
                v{pkg.version}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-md space-y-8"
                    >
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-emerald-500/20">
                                <img src={logo} alt="Karambola Logo" className="w-full h-full object-cover" />
                            </div>
                            <h1 className="text-4xl font-bold">Quanti giocatori?</h1>
                            <p className="text-white/60 text-lg">Seleziona il numero di partecipanti</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[2, 3, 4, 5, 6, 7].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => { setNumPlayers(num); setStep(2); }}
                                    className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-2xl text-2xl font-bold transition-all hover:scale-105 hover:shadow-emerald-500/20 hover:ring-2 hover:ring-emerald-500/50"
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                        {/* Custom Number Input */}
                        <form onSubmit={handleCustomNumSubmit} className="mt-4 flex gap-2">
                            <input
                                type="number"
                                placeholder="Altro..."
                                value={customNum}
                                onChange={(e) => setCustomNum(e.target.value)}
                                min="1"
                                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-center focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium placeholder:text-neutral-600"
                            />
                            <button
                                type="submit"
                                disabled={!customNum}
                                className="aspect-square bg-neutral-700 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-neutral-700 rounded-xl flex items-center justify-center transition-colors w-12"
                            >
                                <Play className="w-5 h-5 fill-current" />
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-md space-y-6 relative"
                    >
                        <button
                            onClick={() => setStep(1)}
                            className="absolute left-0 top-0 p-2 text-white/50 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-emerald-500/20">
                                <img src={logo} alt="Karambola Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Inserisci i nomi</h2>
                                <p className="text-white/60 text-sm">Premi invio per confermare</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {players.map((player, index) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <input
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        placeholder={`Giocatore ${player.id}`}
                                        value={player.name}
                                        onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium placeholder:text-neutral-600"
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={handleStartGame}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Inizia Partita
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

SetupScreen.propTypes = {
    onStartGame: PropTypes.func.isRequired
};
