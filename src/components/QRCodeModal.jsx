import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const APP_URL = 'https://giuseppeambrosio97.github.io/karambola-score/';

export default function QRCodeModal({ isOpen, onClose, players = [], gameStartTime = null }) {
    const [includeState, setIncludeState] = useState(true);

    // Generate URLs
    const getShareUrl = () => {
        if (!includeState) return APP_URL;

        const state = { players, gameStartTime, isPlaying: true };
        const encodedState = btoa(JSON.stringify(state));
        return `${APP_URL}?state=${encodedState}`;
    };

    const shareUrl = getShareUrl();

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
                        className="fixed inset-x-4 top-[8%] max-w-sm mx-auto z-50 bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-xl">
                                    <Share2 className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white tracking-tight">Condividi</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col items-center gap-6">
                            {/* Toggle Selector */}
                            <div className="w-full bg-black/20 p-1 rounded-2xl flex border border-white/5">
                                <button
                                    onClick={() => setIncludeState(false)}
                                    className={clsx(
                                        "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                                        !includeState ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    Solo App
                                </button>
                                <button
                                    onClick={() => setIncludeState(true)}
                                    className={clsx(
                                        "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                                        includeState ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    Stato Corrente
                                </button>
                            </div>

                            {/* QR Code */}
                            <motion.div
                                key={includeState ? 'state' : 'app'}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-5 rounded-3xl shadow-2xl border-4 border-white/10"
                            >
                                <QRCodeSVG
                                    value={shareUrl}
                                    size={200}
                                    level={includeState ? "M" : "H"}
                                    bgColor="#ffffff"
                                    fgColor="#171717"
                                />
                            </motion.div>

                            {/* URL Preview */}
                            <div className="w-full">
                                <p className="text-white/30 text-[9px] text-center font-mono mb-2 uppercase tracking-widest">
                                    {includeState ? "Link con dati partita" : "Link installazione app"}
                                </p>
                                <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center gap-2 group relative">
                                    <p className="flex-1 text-white/60 text-[10px] font-mono break-all select-all line-clamp-2 text-left">
                                        {shareUrl}
                                    </p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(shareUrl);
                                            const btn = document.getElementById('copy-feedback');
                                            if (btn) {
                                                btn.style.opacity = '1';
                                                setTimeout(() => btn.style.opacity = '0', 2000);
                                            }
                                        }}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                                        title="Copia link"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <div
                                        id="copy-feedback"
                                        className="absolute -top-8 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 transition-opacity pointer-events-none"
                                    >
                                        Copiato!
                                    </div>
                                </div>
                            </div>

                            {/* Share Button */}
                            <div className="w-full space-y-3">
                                <button
                                    onClick={() => {
                                        const title = includeState ? 'Karambola Score - Partita in corso' : 'Karambola Score';
                                        if (navigator.share) {
                                            navigator.share({ title, url: shareUrl });
                                        } else {
                                            navigator.clipboard.writeText(shareUrl);
                                            alert('Link copiato!');
                                        }
                                    }}
                                    className={clsx(
                                        "w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg",
                                        includeState ? "bg-emerald-500 hover:bg-emerald-400" : "bg-blue-500 hover:bg-blue-400"
                                    )}
                                >
                                    <Share2 className="w-4 h-4" />
                                    {includeState ? "Condividi Stato Partita" : "Condividi App"}
                                </button>
                                <p className="text-[10px] text-center text-white/40 px-6 leading-relaxed">
                                    {includeState
                                        ? "Include giocatori, punteggi e timer attuale. Ideale per continuare su un altro dispositivo."
                                        : "Invia il link per installare l'app su un nuovo dispositivo."}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

QRCodeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    players: PropTypes.array,
    gameStartTime: PropTypes.number
};

