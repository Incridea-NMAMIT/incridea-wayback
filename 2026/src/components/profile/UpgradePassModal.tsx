import { useState, useEffect } from "react";
import { X, CheckCircle, ShieldCheck } from "lucide-react";
import LiquidGlassCard from "../liquidglass/LiquidGlassCard";
import { initiatePayment, verifyPayment } from "../../api/payment";
import { showToast } from "../../utils/toast";
import PaymentProcessingModal from "../PaymentProcessingModal";

interface UpgradePassModalProps {
    onClose: () => void;
    userId: string;
    category: string;
    collegeId: number;
    isSpotRegistration?: boolean;
}

export default function UpgradePassModal({
    onClose,
    userId,
    category,
    collegeId,
    isSpotRegistration,
}: UpgradePassModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);

    // Calculate pricing
    const isInternalNMAMIT = category === "INTERNAL" && collegeId === 1;
    const amount = isSpotRegistration ? 800 : isInternalNMAMIT ? 250 : 450;

    useEffect(() => {
        // Disable scrolling behind modal
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            setIsProcessing(true);

            const res = await loadRazorpayScript();
            if (!res) {
                showToast("Razorpay SDK failed to load. Are you online?", "error");
                setIsProcessing(false);
                return;
            }

            const data = await initiatePayment({
                registrationId: "upgrade-pass",
            });

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: data.name,
                description: data.description,
                order_id: data.orderId,
                handler: async function (response: any) {
                    setShowProcessingModal(true);
                    try {
                        await verifyPayment(response);
                    } catch (error) {
                        console.error("Verification failed", error);
                        setPaymentFailed(true);
                    }
                },
                prefill: data.prefill,
                theme: {
                    color: "#0284c7",
                },
            };

            const rzp = new (window as any).Razorpay(options);

            rzp.on("payment.failed", function (response: any) {
                console.error("Payment failed", response.error);
                showToast("Payment failed or was cancelled.", "error");
                setPaymentFailed(true);
                setShowProcessingModal(true);
            });

            rzp.open();
        } catch (error: any) {
            console.error("Initiate Payment Error:", error);
            showToast(error.response?.data?.message || "Failed to initiate payment", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
                <LiquidGlassCard className="w-full max-w-[340px] md:max-w-[500px] lg:w-1/3 lg:max-w-none p-5 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-moco font-bold text-white bg-clip-text text-transparent bg-linear-to-r from-amber-400 to-amber-600">
                                Upgrade Pass
                            </h2>
                            <p className="text-slate-300 text-xs mt-0.5">
                                Upgrade to Dimensional Pass
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4 my-2 flex-grow">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-amber-400 w-6 h-6 shrink-0" />
                                <p className="text-sm text-slate-200">
                                    You currently have an <span className="font-bold text-white">Events Only</span> pass. Upgrade now to get full access to the fest, including complimentary pronite and special attractions!
                                </p>
                            </div>

                            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-lg mt-2">
                                <span className="text-slate-300 font-medium">Upgrade Fee</span>
                                <span className="text-2xl font-bold text-white">
                                    ₹{amount}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400 text-center leading-relaxed px-2">
                            By proceeding, I agree to the{" "}
                            <a
                                href="/terms-and-conditions"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-400 hover:text-sky-300 hover:underline inline-flex items-center"
                            >
                                Terms and Conditions
                            </a>
                            {", "}
                            <a
                                href="/privacy-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-400 hover:text-sky-300 hover:underline inline-flex items-center"
                            >
                                Privacy Policy
                            </a>
                            {", and "}
                            <a
                                href="/refund-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-400 hover:text-sky-300 hover:underline inline-flex items-center"
                            >
                                Refund Policy
                            </a>{" "}
                            of Incridea.
                        </p>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full mt-6 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg tracking-wide"
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Processing...
                            </span>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Pay Now (₹{amount})
                            </>
                        )}
                    </button>
                </LiquidGlassCard>
            </div>

            {showProcessingModal && (
                <PaymentProcessingModal
                    isOpen={showProcessingModal}
                    onClose={() => {
                        setShowProcessingModal(false);
                        if (!paymentFailed) {
                            onClose(); // Close the upgrade modal on success
                            window.location.reload(); // Refresh to update PID and UI
                        }
                    }}
                    userId={userId}
                    paymentType="UPGRADE"
                    failed={paymentFailed}
                />
            )}
        </>
    );
}
