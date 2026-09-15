import { useState, useEffect } from "react";
import { X, Zap, Building2, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LiquidGlassCard from "../liquidglass/LiquidGlassCard";
import CustomDropdown from "../ui/CustomDropdown";
import { merchPurchaseSchema, type MerchPurchaseFormData } from "../../schemas/merchSchema";
import { useAuth } from "../../hooks/useAuth";
import { initiatePayment, verifyPayment } from "../../api/payment";
import { toast } from "react-toastify";
import PaymentProcessingModal from "../PaymentProcessingModal";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useQuery } from '@tanstack/react-query';
import { fetchRegistrationConfig } from "../../api/public";
import { isInAppBrowser } from "../../utils/browser";

interface MerchBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productPrice: number;
  productSizes?: string[];
}

const MerchBuyModal = ({
  isOpen,
  onClose,
  productName,
  productPrice,
  productSizes = [],
}: MerchBuyModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const { user } = useAuth();
  const isNMAMIT = user?.collegeId === 1;
  const isAlumni = user?.category === 'ALUMNI';
  const [isOtherBranch, setIsOtherBranch] = useState(false);

  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen);

  const { data: config } = useQuery({
    queryKey: ['registration-config'],
    queryFn: fetchRegistrationConfig,
  });

  const isMultiMerchAllowed = config?.allowMultiMerch && user?.category === 'INTERNAL';
  const merchPrice = config?.fees?.merchTshirtPrice || 499;

  const quantity = productSizes.length > 0 ? productSizes.length : 1;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MerchPurchaseFormData>({
    resolver: zodResolver(merchPurchaseSchema),
    defaultValues: {
      size: (productSizes[0] || "M") as MerchPurchaseFormData['size'],
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("collegeName", user.college || "");
      if (productSizes.length > 0) setValue("size", productSizes[0] as MerchPurchaseFormData['size']);

      if (isAlumni) {
        setValue("branch", "ALUMNI");
        setValue("semester", "0");
      }
    }
  }, [user, isOpen, productSizes, setValue, isAlumni]);

  const calculateTotalPrice = (currentSize: string) => {
    let price = merchPrice;
    if (currentSize === '3XL') price += 10;
    if (currentSize === '4XL') price += 20;
    return price * quantity;
  };

  const finalPrice = isMultiMerchAllowed ? calculateTotalPrice(watch("size") || "M") : productPrice;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onSubmit = async (data: MerchPurchaseFormData) => {
    setIsSubmitting(true);

    try {
      const isMerchAvailable = config?.merchOpen || (isAlumni && config?.allowAlumniMerch);
      if (!isMerchAvailable) {
        toast.error("Merchandise bookings are currently closed.");
        setIsSubmitting(false);
        return;
      }

      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsSubmitting(false);
        return;
      }

      const merchItems = isMultiMerchAllowed ? Array.from({ length: quantity }).map(() => ({ size: data.size })) : [{ size: data.size }];

      const orderData = await initiatePayment({
        registrationId: 'merch-tshirt',
        size: data.size,
        merchItems: (isMultiMerchAllowed && merchItems.length > 0) ? merchItems : undefined,
        semester: data.semester,
        branch: data.branch,
        section: data.section,
        usn: data.usn
      });


      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.name,
        description: isMultiMerchAllowed && quantity > 1 ? `T-Shirt x${quantity}` : `T-Shirt (${data.size})`,
        order_id: orderData.orderId,
        prefill: {
          name: data.name,
          email: user?.email,
          contact: user?.phoneNumber
        },
        notes: {
          size: data.size,
          usn: data.usn,
          branch: data.branch,
          semester: data.semester,
          section: data.section,
          college: data.collegeName
        },
        handler: async function (response: any) {
          setShowProcessingModal(true);
          try {
            verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }).catch(e => console.error(e));
          } catch (e) {
            console.error("Verification trigger failed", e);
          }
        },
        theme: {
          color: "#5924ae"
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        toast.error(response.error.reason || "Payment Failed");
      });
      rzp1.open();

    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 md:px-6 bg-black/50 backdrop-blur-sm overflow-y-auto py-4 sm:py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="w-full max-w-md sm:max-w-lg flex-shrink-0 my-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <LiquidGlassCard className="relative p-3 sm:p-6 max-h-[85vh] sm:max-h-[95vh] overflow-y-auto w-full">
                { }
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors z-10 cursor-pointer cursor-target"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>

                <div className="flex flex-col h-full">
                  { }
                  <div className="mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {productName}
                    </h2>
                    <p className="text-gray-400 text-base sm:text-sm">
                      Complete your details to proceed
                    </p>
                  </div>

                  { }
                  <div className="mb-4 p-4 bg-gradient-to-r from-[#5924ae]/10 to-[#4a1d91]/10 border border-[#5924ae]/30 rounded-lg flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl sm:text-lg font-bold text-white">Order Total</span>
                      <span className="text-2xl sm:text-xl font-bold text-[#bca4ff]">
                        ₹{finalPrice}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-300 pt-3 border-t border-[#5924ae]/20">
                      <div className="flex items-center gap-1.5 bg-[#5924ae]/20 px-3 py-1.5 rounded-md border border-[#5924ae]/30">
                        <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#bca4ff]" />
                        <span className="font-medium text-xs sm:text-sm">Size: <span className="text-white font-bold ml-1">{watch("size") || ""}</span></span>
                      </div>
                      {isMultiMerchAllowed && (
                        <div className="flex items-center gap-1.5 bg-[#5924ae]/20 px-3 py-1.5 rounded-md border border-[#5924ae]/30">
                          <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#bca4ff]" />
                          <span className="font-medium text-xs sm:text-sm">Quantity: <span className="text-white font-bold ml-1">{quantity}</span></span>
                        </div>
                      )}
                    </div>
                  </div>

                  { }
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 flex-1 px-1 pb-2">
                    <input type="hidden" {...register("name")} />
                    <input type="hidden" {...register("collegeName")} />

                    {!isAlumni && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {isNMAMIT && (
                          <div>
                            <label className="flex items-center text-sm sm:text-xs font-bold text-white tracking-tight mb-1.5">
                              <Zap className="w-3.5 h-3.5 mr-2 text-[#bca4ff]" />
                              USN
                            </label>
                            <input
                              {...register("usn")}
                              onChange={(e) => {
                                e.target.value = e.target.value.toUpperCase();
                                register("usn").onChange(e);
                              }}
                              type="text"
                              placeholder="e.g., NNMXXYYZZZ"
                              className={`w-full px-4 py-2.5 rounded-xl bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border text-white text-sm sm:text-xs placeholder-gray-500/70 transition-all focus:outline-none ${errors.usn
                                ? "border-red-500/50 focus:bg-red-500/10 focus:border-red-500"
                                : "border-white/20 focus:bg-white/15 focus:border-[#bca4ff]/50"
                                }`}
                            />
                            {errors.usn && (
                              <p className="text-red-400 text-[10px] mt-1">{errors.usn.message}</p>
                            )}
                          </div>
                        )}

                        <div>
                          <label className="flex items-center text-sm sm:text-xs font-bold text-white tracking-tight mb-1.5">
                            <Building2 className="w-3.5 h-3.5 mr-2 text-[#bca4ff]" />
                            {isNMAMIT ? 'Branch' : 'Department'}
                          </label>
                          {isNMAMIT ? (
                            <>
                              <CustomDropdown
                                options={[
                                  { label: "Artificial Intelligence & Data Science", value: "Artificial Intelligence & Data Science" },
                                  { label: "Artificial Intelligence & Machine Learning", value: "Artificial Intelligence & Machine Learning" },
                                  { label: "Biotechnology", value: "Biotechnology" },
                                  { label: "Civil Engineering", value: "Civil Engineering" },
                                  { label: "Computer & Communication Engineering", value: "Computer & Communication Engineering" },
                                  { label: "Computer Science & Engineering", value: "Computer Science & Engineering" },
                                  { label: "Computer Science & Engineering (Cyber Security)", value: "Computer Science & Engineering (Cyber Security)" },
                                  { label: "Electrical & Electronics Engineering", value: "Electrical & Electronics Engineering" },
                                  { label: "Electronics & Communication Engineering", value: "Electronics & Communication Engineering" },
                                  { label: "Electronics Engineering (VLSI Design & Technology)", value: "Electronics Engineering (VLSI Design & Technology)" },
                                  { label: "Electronics & Communication (Advanced Communication Technology)", value: "Electronics & Communication (Advanced Communication Technology)" },
                                  { label: "Information Science & Engineering", value: "Information Science & Engineering" },
                                  { label: "Robotics & Artificial Intelligence", value: "Robotics & Artificial Intelligence" },
                                  { label: "Mechanical Engineering", value: "Mechanical Engineering" }
                                ]}
                                value={isOtherBranch ? "Other" : (watch("branch") || "")}
                                onChange={(val) => {
                                  if (val === 'Other') {
                                    setIsOtherBranch(true);
                                    setValue("branch", "", { shouldValidate: true });
                                  } else {
                                    setIsOtherBranch(false);
                                    setValue("branch", val as any, { shouldValidate: true });
                                  }
                                }}
                                placeholder="Select Branch"
                                error={errors.branch?.message}
                                dropUp
                                maxHeight="200px"
                              />
                              {isOtherBranch && (
                                <input
                                  type="text"
                                  placeholder="Type your branch"
                                  className={`w-full px-4 py-2.5 mt-2 rounded-xl bg-slate-950/20 text-white text-sm sm:text-xs font-bold placeholder-gray-500/70 border border-white/10 transition-all focus:outline-none ${errors.branch
                                    ? "border-red-500/50 focus:bg-red-500/10 focus:border-red-500"
                                    : "border-white/20 focus:bg-white/15 focus:border-[#bca4ff]/50"
                                    }`}
                                  onChange={(e) => setValue("branch", e.target.value, { shouldValidate: true })}
                                />
                              )}
                            </>
                          ) : (
                            <input
                              {...register("branch")}
                              type="text"
                              placeholder="e.g. MCA"
                              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/20 text-white text-sm sm:text-xs font-bold placeholder-gray-500/70 border border-white/10 transition-all focus:outline-none ${errors.branch
                                ? "border-red-500/50 focus:bg-red-500/10 focus:border-red-500"
                                : "border-white/20 focus:bg-white/15 focus:border-[#bca4ff]/50"
                                }`}
                            />
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm sm:text-xs font-bold text-white tracking-tight mb-1.5">
                            <Zap className="w-3.5 h-3.5 mr-2 text-[#bca4ff]" />
                            {isNMAMIT ? 'Sem' : 'Year'}
                          </label>
                          {isNMAMIT ? (
                            <CustomDropdown
                              options={[
                                { label: "1st", value: "1" },
                                { label: "2nd", value: "2" },
                                { label: "3rd", value: "3" },
                                { label: "4th", value: "4" },
                                { label: "5th", value: "5" },
                                { label: "6th", value: "6" },
                                { label: "7th", value: "7" },
                                { label: "8th", value: "8" },
                              ]}
                              value={watch("semester") || ""}
                              onChange={(val) => setValue("semester", val as any, { shouldValidate: true })}
                              placeholder="Select Sem"
                              error={errors.semester?.message}
                              dropUp
                              maxHeight="150px"
                            />
                          ) : (
                            <input
                              {...register("semester")}
                              type="text"
                              placeholder="e.g. 1, 2, 3, 4"
                              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/20 text-white text-sm sm:text-xs font-bold placeholder-gray-500/70 border border-white/10 transition-all focus:outline-none ${errors.semester
                                ? "border-red-500/50 focus:bg-red-500/10 focus:border-red-500"
                                : "border-white/20 focus:bg-white/15 focus:border-[#bca4ff]/50"
                                }`}
                            />
                          )}
                        </div>

                        {/* Section Dropdown - Only for NMAMIT non-alumni */}
                        {isNMAMIT && (
                          <div>
                            <label className="flex items-center text-sm sm:text-xs font-bold text-white tracking-tight mb-1.5">
                              <Zap className="w-3.5 h-3.5 mr-2 text-[#bca4ff]" />
                              Section
                            </label>
                            <CustomDropdown
                              options={Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(s => ({ label: s, value: s }))}
                              value={watch("section") || ""}
                              onChange={(val) => setValue("section", val as any, { shouldValidate: true })}
                              placeholder="Select Section"
                              error={errors.section?.message}
                              dropUp
                              maxHeight="150px"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {isInAppBrowser() && (
                      <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div>
                            <h4 className="text-amber-500 font-bold mb-0.5 text-sm">In-App Browser Detected</h4>
                            <p className="text-amber-400/80 text-xs">
                              UPI Apps might fail. Use <strong>Chrome/Safari</strong>, or select <strong>UPI ID</strong> instead.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="sticky bottom-[-1rem] sm:bottom-[-1.5rem] z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 bg-[#151515]/30 backdrop-blur-md border-t border-white/10 mt-auto rounded-b-xl">
                      <div className="flex gap-3">
                        <motion.button
                          type="button"
                          onClick={handleClose}
                          className="relative flex-1 py-2.5 sm:py-3 -skew-x-[20deg] font-black uppercase tracking-[0.15em] text-sm sm:text-xs rounded-lg border border-white/20 backdrop-blur-md bg-white/5 text-gray-200 hover:bg-white/10 transition-all duration-300 overflow-hidden cursor-pointer cursor-target"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2 skew-x-[20deg] pointer-events-none">
                            Cancel
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -translate-x-full animate-shimmer skew-x-[20deg] pointer-events-none" />
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className={`relative flex-1 py-2.5 sm:py-3 -skew-x-[20deg] font-black uppercase tracking-[0.15em] text-sm sm:text-xs rounded-lg border backdrop-blur-md transition-all duration-300 overflow-hidden z-50 pointer-events-auto ${isSubmitting
                            ? "bg-gray-800 text-gray-500 border-white/5 cursor-not-allowed"
                            : "bg-[#5924ae] hover:bg-[#4a1d91] text-white border-white/20 shadow-[0_0_30px_rgba(89,36,174,0.4)] hover:shadow-[0_0_50px_rgba(89,36,174,0.6)] cursor-pointer cursor-target"
                            }`}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2 skew-x-[20deg] pointer-events-none">
                            {isSubmitting ? "Processing..." : "Pay Now"}
                          </span>
                          {!isSubmitting && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -translate-x-full animate-shimmer skew-x-[20deg] pointer-events-none" />
                          )}
                        </motion.button>
                      </div>
                      <p className="text-xs sm:text-[10px] text-gray-500 text-center mt-2">
                        ✓ Secure payment
                      </p>
                    </div>
                  </form>
                </div>
              </LiquidGlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentProcessingModal
        isOpen={showProcessingModal}
        onClose={() => {
          setShowProcessingModal(false)
          onClose()
          window.location.reload()
        }}
        userId={user?.id}
        isAlumni={isAlumni}
        paymentType="MERCH"
      />
    </>
  );
};

export default MerchBuyModal;
