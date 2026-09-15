import { useState } from "react";
import QRCode from "react-qr-code";
import { X, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import LiquidGlassCard from "../liquidglass/LiquidGlassCard";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

interface MerchOrder {
    id: string;
    paymentOrderId: string;
    size: string;
}

interface Props {
    merchOrders: MerchOrder[];
}

const MerchOrderQRCodes = ({ merchOrders }: Props) => {
    const [selectedQR, setSelectedQR] = useState<string | null>(null);
    useBodyScrollLock(!!selectedQR);

    if (!merchOrders || merchOrders.length === 0) return null;

    const groupedOrders = merchOrders.reduce((acc, order) => {
        if (!acc[order.paymentOrderId]) {
            acc[order.paymentOrderId] = [];
        }
        acc[order.paymentOrderId].push(order);
        return acc;
    }, {} as Record<string, MerchOrder[]>);

    return (
        <div className="w-full mt-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                Your Receipts (QRs)
            </h3>
            <p className="text-gray-400 text-sm mb-4">Click on a QR code to enlarge it. Show this when collecting your T-shirt.</p>

            <div className="flex flex-wrap gap-4">
                {Object.entries(groupedOrders).map(([paymentOrderId, orders], idx) => (
                    <div
                        key={paymentOrderId}
                        className="flex flex-col items-center bg-black/40 border border-emerald-500/30 p-3 rounded-xl cursor-pointer hover:bg-emerald-500/10 transition-colors"
                        onClick={() => setSelectedQR(paymentOrderId)}
                    >
                        <div className="bg-white p-2 rounded-lg mb-2">
                            <QRCode value={paymentOrderId} size={80} level="M" />
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
                            {orders.map((order, i) => (
                                <span key={order.id || i} className="text-[10px] sm:text-[11px] text-white font-mono bg-[#5924ae] px-1.5 py-0.5 rounded">
                                    Size: {order.size}
                                </span>
                            ))}
                        </div>
                        <span className="text-[10px] text-gray-500 mt-2 uppercase text-center block max-w-[120px]">
                            {orders.length} Item{orders.length > 1 ? 's' : ''} <br />
                            Order {idx + 1}
                        </span>
                    </div>
                ))}
            </div>

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedQR && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedQR(null)}
                        >
                            <motion.div
                                className="relative flex flex-col items-center justify-center"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <LiquidGlassCard className="p-6 sm:p-8 flex flex-col items-center">
                                    <button
                                        onClick={() => setSelectedQR(null)}
                                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors z-10 cursor-pointer"
                                        aria-label="Close QR Modal"
                                    >
                                        <X className="w-6 h-6 text-gray-400 hover:text-white" />
                                    </button>

                                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 uppercase tracking-wider font-mono">
                                        Collection QR
                                    </h2>

                                    <div className="bg-white p-4 sm:p-6 rounded-xl">
                                        <QRCode value={selectedQR} size={250} level="M" />
                                    </div>

                                    <p className="mt-6 text-emerald-400 font-mono text-xs sm:text-sm text-center">
                                        Order ID: <br className="sm:hidden" />
                                        <span className="text-white">{selectedQR}</span>
                                    </p>
                                    <p className="mt-2 text-gray-400 text-xs text-center max-w-xs">
                                        Please present this QR code to the volunteer at the merch desk.
                                    </p>
                                </LiquidGlassCard>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default MerchOrderQRCodes;
