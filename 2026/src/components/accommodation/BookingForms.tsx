import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UploadButton } from '../../utils/uploadthing'
import { toast } from 'react-toastify'
import { bookIndividual } from '../../api/accommodation'
import { Loader2, X, FileText } from 'lucide-react'

const individualSchema = z.object({

  checkIn: z.enum(['2026-03-05', '2026-03-06', '2026-03-07', '2026-03-08'], { message: 'Please select a valid Check-in date' }),
  checkOut: z.enum(['2026-03-05', '2026-03-06', '2026-03-07', '2026-03-08', '2026-03-09'], { message: 'Please select a valid Check-out date' }),
  idCard: z.string({ message: 'Please upload your college id photo' }).url('ID Card image is required'),
})

import { isInAppBrowser } from '../../utils/browser'

type IndividualForm = z.infer<typeof individualSchema>


import PaymentProcessingModal from '../PaymentProcessingModal'
import { useAuth } from '../../hooks/useAuth'

export const IndividualBookingForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<IndividualForm>({
    resolver: zodResolver(individualSchema),
    defaultValues: {

    }
  })

  const checkIn = watch('checkIn')
  const checkOut = watch('checkOut')
  const idCard = watch('idCard')

  const calculatePrice = () => {
    if (!checkIn || !checkOut) return null
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    if (checkOutDate < checkInDate) return null

    const durationMs = checkOutDate.getTime() - checkInDate.getTime()
    const durationDays = durationMs > 0 ? Math.ceil(durationMs / (1000 * 60 * 60 * 24)) : 1

    const baseAmount = 250
    const amount = baseAmount * durationDays
    const amountInRupees = Math.ceil(amount / (1 - 0.0236))

    return {
      days: durationDays,
      baseAmount: amount,
      totalAmount: amountInRupees
    }
  }

  const priceDetails = calculatePrice()

  const onSubmit = async (data: IndividualForm) => {
    setLoading(true)
    try {
      const response = await bookIndividual({
        ...data,
        checkIn: data.checkIn,
        checkOut: data.checkOut
      })

      const { payment } = response

      const loadScript = (src: string) => {
        return new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = src
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })
      }

      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      if (!res) {
        toast.error('Razorpay SDK failed to load')
        setLoading(false)
        return
      }

      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: "Incridea",
        description: "Accommodation Booking",
        order_id: payment.orderId,
        handler: async function (response: any) {
          setPaymentModalOpen(true)
          try {
            await import('../../api/registration').then(m => m.verifyPaymentSignature(response))
          } catch (e) {
            console.error('Verification failed', e)
            toast.error('Payment verification failed, please check status')
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phoneNumber
        },
        theme: {
          color: '#3399cc'
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error.description || 'Payment Failed')
      })
      rzp.open()

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


          <div>
            { }
            <label className="block text-base sm:text-sm font-medium mb-1">Check In</label>
            <select {...register('checkIn')} className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-slate-200 focus:border-sky-500 outline-none transition-colors">
              <option value="" className="bg-slate-900 text-slate-400">Select Date</option>
              <option value="2026-03-05" className="bg-slate-900 text-white">March 5</option>
              <option value="2026-03-06" className="bg-slate-900 text-white">March 6</option>
              <option value="2026-03-07" className="bg-slate-900 text-white">March 7</option>
              <option value="2026-03-08" className="bg-slate-900 text-white">March 8</option>

            </select>
            {errors.checkIn && <p className="text-red-400 text-xs mt-1">{errors.checkIn.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Check Out</label>
            <select {...register('checkOut')} className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-slate-200 focus:border-sky-500 outline-none transition-colors">
              <option value="" className="bg-slate-900 text-slate-400">Select Date</option>
              <option value="2026-03-06" className="bg-slate-900 text-white">March 6</option>
              <option value="2026-03-07" className="bg-slate-900 text-white">March 7</option>
              <option value="2026-03-08" className="bg-slate-900 text-white">March 8</option>
              <option value="2026-03-09" className="bg-slate-900 text-white">March 9</option>
            </select>
            {errors.checkOut && <p className="text-red-400 text-xs mt-1">{errors.checkOut.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ID Card (College ID)</label>
          <div className="border border-slate-700 border-dashed rounded p-4 flex flex-col items-center justify-center bg-slate-900/50">
            {idCard ? (
              <div className="relative w-full h-48 group">
                {idCard.toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white/10 text-white rounded-md p-4">
                    <FileText className="w-12 h-12 mb-2 text-white/70" />
                    <span className="text-sm text-white/70 break-all text-center max-w-full truncate px-2">
                      {idCard.split('/').pop()}
                    </span>
                  </div>
                ) : (
                  <img
                    src={idCard}
                    alt="ID Card"
                    className="w-full h-full object-contain rounded-md"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                )}

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 rounded-md transition-opacity">
                  <button
                    type="button"
                    onClick={() => setValue('idCard', '')}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors backdrop-blur-sm"
                    title="Remove Image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <UploadButton
                endpoint="accommodationIdProof"
                onClientUploadComplete={(res) => {
                  console.log('Upload response:', res)
                  const file = res?.[0]
                  const url = file?.serverData?.fileUrl || file?.ufsUrl
                  if (url) {
                    setValue('idCard', url)
                    toast.success('Upload complete')
                  } else {
                    console.error('Upload successful but no URL found:', file)
                    toast.error('Upload complete but URL missing')
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Upload failed: ${error.message}`)
                }}
              />
            )}
          </div>
          {errors.idCard && <p className="text-red-400 text-xs mt-1">{errors.idCard.message}</p>}
        </div>

        {priceDetails && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-md p-4 mt-4">
            <h3 className="font-semibold text-sky-400 mb-2">Payment Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Duration ({priceDetails.days} {priceDetails.days === 1 ? 'day' : 'days'})</span>
                <span>₹{priceDetails.baseAmount}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Internet Handling Fee (2.36%)</span>
                <span>₹{(priceDetails.totalAmount - priceDetails.baseAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-700 mt-2">
                <span>Total Amount</span>
                <span>₹{priceDetails.totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {isInAppBrowser() && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4 mt-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="text-amber-500 font-bold mb-1">In-App Browser Detected</h4>
                <p className="text-amber-400/80 text-sm">
                  UPI Apps (GPay, PhonePe) might fail to open in this browser (Instagram/Facebook/Snapchat). Please open this site in <strong>Chrome</strong> or <strong>Safari</strong>, or select <strong>UPI ID</strong> instead of GPay/PhonePe on the next screen.
                </p>
              </div>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed cursor-target mt-4">
          <span className="block skew-x-10">{loading ? <Loader2 className="animate-spin" /> : 'Book & Pay'}</span>
        </button>
      </form>

      <PaymentProcessingModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false)
          onSuccess()
        }}
        userId={user?.id}
        paymentType='ACCOMMODATION'
      />
    </>
  )
}



