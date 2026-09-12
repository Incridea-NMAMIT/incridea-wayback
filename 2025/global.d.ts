/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
  interface Window {
    Razorpay: new (_: RazorpayOptions) => Razorpay;
  }

  interface Razorpay {
    open: () => void;
  }

  interface RazorpayOptions {
    key: string;
    name: string;
    currency: string;
    amount: number;
    order_id: string;
    description: string;
    image: string;
    handler: (_: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => Promise<void>;
    prefill: {
      name: string;
      email: string;
      contact?: string;
    };
  }

  interface YouTubePlayerPatch {
    playVideo: () => void;
    pauseVideo: () => void;
    isMuted: () => boolean;
    mute: () => void;
    unMute: () => void;
  }
}

export {};
