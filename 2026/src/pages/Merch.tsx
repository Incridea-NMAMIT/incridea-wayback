import { useState, Suspense, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import LiquidGlassCard from "../components/liquidglass/LiquidGlassCard";
import MerchBuyModal from "../components/merch/MerchBuyModal";
import TShirt3DModel from "../components/merch/TShirt3DModel";
import SizeChart from "../components/merch/SizeChart";
import MerchOrderQRCodes from "../components/merch/MerchOrderQRCodes";
import CustomDropdown from "../components/ui/CustomDropdown";
import SEO from "../components/SEO";
import { Rotate3d } from "lucide-react";
import LightRays from "@/components/LightRays";
import ShootingStars from "@/components/ShootingStars";

const styles = `
  @keyframes shimmer {
    0% { transform: translateX(-150%); }
    100% { transform: translateX(200%); }
  }
  @keyframes scan {
    0% { background-position: 0 0; }
    100% { background-position: 0 100%; }
  }
  .animate-shimmer {
    animation: shimmer 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .animate-scan {
    animation: scan 4s linear infinite;
  }
`;

import { fetchRegistrationConfig } from '../api/public';
import { useQuery } from '@tanstack/react-query';

import { getMyPaymentStatus } from "../api/payment";
import { useAuth } from "../hooks/useAuth";

const Merch = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const { user } = useAuth();

  const { data: config } = useQuery({
    queryKey: ['registration-config'],
    queryFn: fetchRegistrationConfig,
  });

  const { data: paymentStatus } = useQuery({
    queryKey: ['my-merch-payment-status'],
    queryFn: () => getMyPaymentStatus('MERCH'),
    enabled: !!user,
    retry: false
  });

  const merchPrice = config?.fees?.merchTshirtPrice || 499;
  const hasPurchased = paymentStatus?.status === 'success';

  const tshirtItem = {
    id: "tshirt",
    name: "Incridea T-Shirt",
    edition: "DIMENSIONAL DRIFT",
    price: merchPrice,
    description:
      "Premium quality Incridea event t-shirt. Made with comfortable cotton blend fabric. Perfect memorabilia from your event experience.",
    details: [
      { text: "100% Premium Cotton Blend" },
      { text: "Comfortable fit and durable" },
      { text: "Available in 8 sizes (XS - 4XL)" },
      { text: "Vibrant Incridea branding" },
    ],
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

  const isMultiMerchAllowed = config?.allowMultiMerch && user?.category === 'INTERNAL';

  const handleBuyClick = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    setShowModal(true);
  };

  const { setHideFooter } = useOutletContext<{ setHideFooter: (hide: boolean) => void }>();

  useEffect(() => {
    setHideFooter(showModal);
    return () => setHideFooter(false);
  }, [showModal, setHideFooter]);



  return (
    <div className="relative min-h-screen font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <SEO
        title="Merchandise"
        description="Buy the exclusive Incridea'26 T-Shirt."
        url="/merch"
      />
      <style>{styles}</style>

      { }
      <div
        className="fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-black/50" />
        <ShootingStars
          starColor="#FFFFFF"
          trailColor="#a7c7e7"
          minSpeed={15}
          maxSpeed={35}
          minDelay={800}
          maxDelay={2500}
        />
      </div>

      { }
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1350px] mx-auto min-h-screen flex flex-col justify-center items-center">

        { }
        <motion.div
          className="relative z-10 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <LiquidGlassCard className="p-0 overflow-hidden relative w-full">

            {/* Content Container */}
            <div className="grid grid-cols-1 xl:grid-cols-2 relative z-10 w-full">
              {/* Vertical Divider */}
              <div className="hidden xl:block absolute left-1/2 top-0 bottom-0 w-px -ml-px bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent z-20" />
              <div className="xl:hidden absolute left-0 right-0 top-[50%] h-px -mt-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent z-20" />

              <div className="px-5 pb-5 pt-0 sm:px-8 sm:pb-8 sm:pt-2 xl:p-10 flex flex-col h-full justify-center relative order-first">

                {/* T-Shirt 3D Model Section */}
                <div className="absolute top-0 left-0 right-0 h-[400px] sm:h-[600px] pointer-events-none z-10 overflow-hidden">
                  {/* Top Shine Effect */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] h-px bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_40px_rgba(255,255,255,1)] z-30" />

                  {/* Light Rays */}
                  <div className="absolute top-4 left-0 right-0 bottom-0 mix-blend-screen brightness-[2.5] md:brightness-150 contrast-125">
                    <LightRays
                      raysOrigin="top-center"
                      raysSpeed={0.8}
                      lightSpread={0.5}
                      rayLength={1.5}
                      raysColor="#ffffff"
                      followMouse={false}
                    />
                  </div>
                </div>

                {/* 3D Model Canvas */}
                <div className="relative w-full h-full min-h-[300px] sm:min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center z-20 cursor-default pointer-events-none">
                    <Suspense
                      fallback={
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                          <span className="text-emerald-400 font-mono text-[10px] sm:text-xs tracking-widest uppercase animate-pulse">Loading Model_</span>
                        </div>
                      }
                    >
                      <TShirt3DModel modelPath="/models/tshirt.glb" />
                    </Suspense>
                  </div>

                  <div className="absolute bottom-6 sm:bottom-8 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-md rounded-full border border-white/5 z-20 opacity-60 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <Rotate3d className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 animate-spin-slow" />
                    <span className="text-[10px] sm:text-xs text-gray-300 font-mono tracking-wider uppercase">Drag to Rotate</span>
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="p-5 sm:p-8 lg:p-10 flex flex-col h-full gap-6 order-last">

                {/* Header */}
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-4 font-mono text-xs tracking-wider">
                    {/* Size Guide/Info */}
                    <div className="flex items-center gap-2 text-emerald-500/80">
                      <span className="opacity-50"></span>
                      <span className="font-bold border-b border-emerald-500/30 pb-0.5">DIMENSIONAL DRIFT</span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-4xl md:text-3xl lg:text-3xl font-black text-white uppercase tracking-tighter leading-none break-words mb-4">
                    {tshirtItem.name}
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-sm font-light border-l-2 border-emerald-500/30 pl-4">
                    {tshirtItem.description}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="flex flex-col">
                  <div className="flex flex-col py-2">
                    {tshirtItem.details.map((detail, idx) => (
                      <div key={idx} className="relative group/item flex flex-col justify-center">
                        <div className="px-4 sm:px-5 py-2 flex items-center gap-4 transition-colors duration-300">
                          <span className="text-emerald-500/50 font-mono text-xs">0{idx + 1}</span>
                          <p className="text-gray-300 font-medium text-xs leading-snug">
                            {detail.text}
                          </p>
                        </div>
                        {/* Divider Line */}
                        {idx !== tshirtItem.details.length - 1 && (
                          <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {hasPurchased && !isMultiMerchAllowed ? (
                  <div className="mt-auto flex flex-col gap-4">
                    <div className="p-6 border border-emerald-500/30 bg-emerald-500/10 rounded-xl backdrop-blur-sm">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Order Confirmed</h3>
                      <p className="text-emerald-300 text-sm sm:text-base">You have already placed your order for the Incridea T-Shirt.</p>
                    </div>
                    {paymentStatus?.merchOrders && <MerchOrderQRCodes merchOrders={paymentStatus.merchOrders} />}
                  </div>
                ) : !user ? (
                  <div className="mt-auto p-6 border border-emerald-500/30 bg-emerald-500/10 rounded-xl backdrop-blur-sm">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Login Required</h3>
                    <p className="text-emerald-300 text-sm sm:text-base">Please <a href="/login" className="underline hover:text-white">login</a> to purchase merchandise.</p>
                  </div>
                ) : (user.category !== 'INTERNAL' && !(user.category === 'ALUMNI' && config?.allowAlumniMerch)) ? (
                  <div className="mt-auto p-6 border border-emerald-500/30 bg-emerald-500/10 rounded-xl backdrop-blur-sm">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Nitte Students Only</h3>
                    <p className="text-emerald-300 text-sm sm:text-base">Merchandise is available for Nitte Students only.</p>
                  </div>
                ) : (!config?.merchOpen && !(user.category === 'ALUMNI' && config?.allowAlumniMerch)) ? (
                  <div className="mt-auto flex flex-col items-center justify-center p-8 border border-amber-500/30 bg-amber-500/10 rounded-xl backdrop-blur-sm text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Bookings Closed</h3>
                    <p className="text-amber-400 text-sm sm:text-base">
                      Merchandise bookings are currently closed for this edition.
                    </p>
                    {paymentStatus?.merchOrders && paymentStatus.merchOrders.length > 0 && (
                      <div className="mt-6 w-full">
                        <MerchOrderQRCodes merchOrders={paymentStatus.merchOrders} />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Size Selection */}
                    <div>
                      {user?.category === 'ALUMNI' && config?.allowAlumniMerch && (
                        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg backdrop-blur-sm">
                          <p className="text-amber-400 text-xs font-medium leading-relaxed">
                            <span className="font-bold">Note:</span> T-Shirts for Alumni will be available for collection <span className="text-white">on 5th March on or before 4:00 PM</span> during the fest.
                          </p>
                        </div>
                      )}
                      <h3 className="text-[10px] sm:text-xs font-bold text-[#a78bfa] mb-3 sm:mb-5 uppercase tracking-[0.2em] font-mono flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#a78bfa] rotate-45" />
                        Sizes
                      </h3>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {sizes.map((size) => (
                          <div
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl font-bold text-xs border cursor-pointer transition-all duration-300 ${selectedSize === size
                              ? "bg-[#5924ae] text-white border-[#a78bfa] shadow-[0_0_15px_rgba(89,36,174,0.5)] scale-110"
                              : "bg-black/40 text-gray-400 border-white/5 hover:border-[#5924ae]/50 hover:text-[#a78bfa]"
                              }`}
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>

                    <SizeChart />

                    {paymentStatus?.merchOrders && paymentStatus.merchOrders.length > 0 && (
                      <MerchOrderQRCodes merchOrders={paymentStatus.merchOrders} />
                    )}

                    {/* Quantity Selection (Internal Only) */}
                    {isMultiMerchAllowed && (
                      <div className="mt-4">
                        <h3 className="text-[10px] sm:text-xs font-bold text-[#a78bfa] mb-3 sm:mb-5 uppercase tracking-[0.2em] font-mono flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#a78bfa] rotate-45" />
                          Quantity
                        </h3>
                        <div className="flex gap-2 w-32">
                          <CustomDropdown
                            options={[
                              { label: "1", value: "1" },
                              { label: "2", value: "2" },
                              { label: "3", value: "3" },
                              { label: "4", value: "4" },
                            ]}
                            value={quantity.toString()}
                            onChange={(val) => setQuantity(parseInt(val))}
                            placeholder="Select Quantity"
                            dropUp={true}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-gray-400 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Total Price</span>
                        <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                          ₹{selectedSize === '3XL' ? (merchPrice + 10) * quantity : selectedSize === '4XL' ? (merchPrice + 20) * quantity : merchPrice * quantity}
                        </span>
                      </div>

                      {/* Buy Button */}
                      <button
                        onClick={handleBuyClick}
                        disabled={!selectedSize}
                        style={{ cursor: !selectedSize ? 'not-allowed' : 'pointer' }}
                        className={`relative w-full py-3 sm:py-4 -skew-x-[20deg] font-black uppercase tracking-[0.15em] text-xs sm:text-sm rounded-lg border backdrop-blur-md transition-all duration-300 overflow-hidden group z-50 pointer-events-auto ${!selectedSize
                          ? "bg-gray-800 text-gray-500 border-white/5"
                          : "bg-[#5924ae] hover:bg-[#4a1d91] text-white border-white/20 shadow-[0_0_30px_rgba(89,36,174,0.4)] hover:shadow-[0_0_50px_rgba(89,36,174,0.6)] cursor-pointer"
                          }`}
                      >
                        {/* Button Text */}
                        <span className="relative z-10 flex items-center justify-center gap-2 skew-x-[20deg] pointer-events-none">
                          {!selectedSize ? "Select Size" : "Buy Now"}
                        </span>
                        {/* Shimmer Effect */}
                        {selectedSize && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -translate-x-full animate-shimmer skew-x-[20deg] pointer-events-none" />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          </LiquidGlassCard>
        </motion.div>

        <MerchBuyModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          productName={tshirtItem.name}
          productPrice={selectedSize === '3XL' ? (merchPrice + 10) * quantity : selectedSize === '4XL' ? (merchPrice + 20) * quantity : merchPrice * quantity}
          productSizes={Array(quantity).fill(selectedSize)}
        />
      </div>
    </div>
  );
};

export default Merch;
