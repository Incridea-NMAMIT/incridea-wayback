import LiquidGlassCard from '../components/liquidglass/LiquidGlassCard';
import SEO from '../components/SEO';



function RefundPolicy() {
  return (
    <>


      <div className="min-h-screen w-full px-4 py-8 text-slate-100 font-sans antialiased md:px-6 md:mx-64">
        <SEO
          title="Refund Policy"
          description="Read the refund policy of Incridea'26."
          url="/refund"
        />
        <LiquidGlassCard
          className="mx-auto w-full max-w-6xl flex flex-col relative p-6 md:p-10"
        >
          <div className="md:p-10">
            <div className="space-y-6 sm:space-y-8">
              <header className="space-y-2 sm:space-y-4">
                <h1 className="text-2xl sm:text-2xl lg:text-3xl tracking-wider font-life-craft text-white drop-shadow-[0_0_15px_rgba(216,180,254,0.3)] font-bold">
                  REFUND POLICY
                </h1>
              </header>
              <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-purple-200/20 to-transparent" />

              <div className="text-slate-200 space-y-6 sm:space-y-8">
                <section>
                  <h2 className="text-lg sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                    Introduction
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-sm lg:text-base">
                    We offer a seamless registration process using Razorpay, a secure payment gateway. This page outlines our refund policy to provide clarity and peace of mind in case of any issues with your payment.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                    Payment Process
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-sm lg:text-base">
                    Our payment process is designed to be easy and convenient for you. We offer multiple payment options, including credit/debit cards, net banking, and UPI. Once you select your preferred payment method, you will be redirected to Razorpay's secure payment gateway to complete the payment process.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                    Refund Policy
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-sm lg:text-base">
                    We understand that sometimes processing errors or technical glitches can occur during the payment process, leading to an unsuccessful transaction. In such cases, the amount paid by you will be credited back to your account automatically within 5-7 business days. Please note that this refund is only applicable in the case of an unsuccessful transaction due to processing errors and not for any other reasons.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                    Non-Refundable Services
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-sm lg:text-base">
                    Please note that our registration services are non-refundable and cannot be cancelled once payment has been made. This policy is in place to ensure that we can deliver the best possible experience for all our customers. Registrations from non-engineering colleges are not permitted. In the event of any false or fraudulent registration, the organizing committee reserves the right to cancel the registration without issuing a refund.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                    Payment Security
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-sm lg:text-base">
                    We take the safety and security of your payment information very seriously. Our payment gateway partner, Razorpay, ensures that all transactions are secure and protected by industry-standard encryption. You can be confident that your payment information is safe when you use our website for registration.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                    Contact Information
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-sm lg:text-base">
                    If you have any questions or concerns about our refund policy or payment process, please do not hesitate to contact our team. You can reach us at <a href="mailto:texxxxxxxxxea@nmamit.in" className="text-sky-300 hover:text-sky-400 transition-colors">texxxxxxxxxea@nmamit.in</a> or <a href="tel:+91886xxxx830" className="text-sky-300 hover:text-sky-400 transition-colors">+91 886xxxx830</a>, and we will be happy to assist you.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="displacementFilter">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.01"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              in2="turbulence"
              in="SourceGraphic"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}

export default RefundPolicy;
