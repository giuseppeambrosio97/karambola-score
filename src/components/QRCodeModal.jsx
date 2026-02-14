import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import PropTypes from 'prop-types';

const APP_URL = 'https://giuseppeambrosio97.github.io/karambola-score/';

export default function QRCodeModal({ isOpen, onClose }) {
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
                        className="fixed inset-x-4 top-[15%] max-w-sm mx-auto z-50 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-emerald-400" />
                                <h2 className="text-lg font-bold text-white">Condividi App</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* QR Code */}
                        <div className="p-8 flex flex-col items-center gap-6">
                            <div className="bg-white p-4 rounded-2xl shadow-lg">
                                <QRCodeSVG
                                    value={APP_URL}
                                    size={200}
                                    level="H"
                                    bgColor="#ffffff"
                                    fgColor="#171717"
                                />
                            </div>

                            <p className="text-white/50 text-xs text-center font-mono break-all select-all">
                                {APP_URL}
                            </p>

                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({ title: 'Karambola Score', url: APP_URL });
                                    } else {
                                        navigator.clipboard.writeText(APP_URL);
                                        alert('Link copiato!');
                                    }
                                }}
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <Share2 className="w-4 h-4" />
                                Condividi Link
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

QRCodeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};
