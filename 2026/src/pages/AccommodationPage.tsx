
import { useQuery } from '@tanstack/react-query'
import { IndividualBookingForm } from '../components/accommodation/BookingForms'
import { getAccommodationStats } from '../api/accommodation'
import { fetchRegistrationConfig } from '../api/public'
import { AlertCircle, Loader2, User, ArrowLeft, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import LiquidGlassCard from '../components/liquidglass/LiquidGlassCard'
import SEO from '../components/SEO'

import { useState } from 'react'

export default function AccommodationPage() {
    const [activeTab, setActiveTab] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL')
    const { data: config } = useQuery({
        queryKey: ['registrationConfig'],
        queryFn: fetchRegistrationConfig,
    })
    const { data: stats, isLoading, refetch } = useQuery({
        queryKey: ['accommodationStats'],
        queryFn: getAccommodationStats,
    })

    const { data: meData, isLoading: isAuthLoading } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            try {
                return await import('../api/auth').then(m => m.fetchMe())
            } catch (e) {
                throw e
            }
        },
        retry: false
    })

    const user = meData?.user

    const { data: bookingData } = useQuery({
        queryKey: ['accommodationUserBooking', user?.id],
        queryFn: async () => {
            const data = await import('../api/accommodation').then(m => m.getUserBookings());
            return data;
        },
        enabled: !!user?.id,
        retry: false
    })

    // Removed automatic redirect for public access

    if (isAuthLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center text-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        )
    }

    // Removed global role restriction redirect


    const accommodationsFull = stats && stats.boys.available <= 0 && stats.girls.available <= 0

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
            <SEO
                title="Accommodation"
                description="Book your accommodation for Incridea'26."
                url="/accommodation"
            />
            <Link to="/" className="fixed top-35 left-8 md:left-50 z-50 inline-flex items-center text-gray-400 hover:text-white transition-colors bg-slate-950/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>

            <header className="mb-10 text-center relative">
                <h1 className="text-5xl md:text-5xl font-moco font-white mb-4">
                    Accommodation
                </h1>
                <p className="text-lg sm:text-sm text-gray-400 max-w-2xl mx-auto">
                    Book your stay for Incridea. Secure a spot for yourself.
                    Limited availability!
                </p>
            </header>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            onClick={() => setActiveTab('INTERNAL')}
                            className={clsx(
                                "px-6 py-2 rounded-md text-base sm:text-sm font-semibold transition-all duration-300 skew-x-[-10deg] cursor-target",
                                activeTab === 'INTERNAL'
                                    ? "bg-[#5b21b6] text-white shadow-lg shadow-purple-500/30"
                                    : "bg-white/5 text-gray-400 hover:bg-[#4c1d95] hover:text-white"
                            )}
                        >
                            <span className="block skew-x-10">Internal Accommodation</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('EXTERNAL')}
                            className={clsx(
                                "px-6 py-2 rounded-md text-base sm:text-sm font-semibold transition-all duration-300 skew-x-[-10deg] cursor-target",
                                activeTab === 'EXTERNAL'
                                    ? "bg-[#5b21b6] text-white shadow-lg shadow-purple-500/30"
                                    : "bg-white/5 text-gray-400 hover:bg-[#4c1d95] hover:text-white"
                            )}
                        >
                            <span className="block skew-x-10">External Accommodation</span>
                        </button>
                    </div>

                    {activeTab === 'INTERNAL' ? (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1 space-y-6">
                                    <LiquidGlassCard className="p-6">
                                        <h2 className="text-2xl sm:text-xl font-bold text-white mb-4 flex items-center"> Availability
                                        </h2>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                                <span className="text-base sm:text-sm text-gray-300">Boys</span>
                                                <span className={clsx("font-bold px-2 py-1 rounded text-base sm:text-sm",
                                                    (stats?.boys.available || 0) > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                                                    {stats?.boys.available} Slots Left
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                                <span className="text-base sm:text-sm text-gray-300">Girls</span>
                                                <span className={clsx("font-bold px-2 py-1 rounded text-base sm:text-sm",
                                                    (stats?.girls.available || 0) > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                                                    {stats?.girls.available} Slots Left
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 text-sm sm:text-xs text-gray-500">
                                            * Accommodation is provided on a first-come, first-served basis.
                                        </div>
                                    </LiquidGlassCard>
                                </div>

                                <div className="lg:col-span-2">
                                    <LiquidGlassCard>
                                        <div className="p-6">
                                            <h2 className="text-2xl sm:text-xl font-bold text-white mb-6 flex items-center border-b border-white/10 pb-4">
                                                <User className="w-5 h-5 mr-2 text-purple-500" /> Individual Booking
                                            </h2>
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                                {config && !config.isAccommodationEnabled ? (
                                                    <div className="text-center py-10 space-y-4">
                                                        <div className="flex justify-center">
                                                            <div className="bg-red-500/20 p-3 rounded-full">
                                                                <AlertCircle className="w-8 h-8 text-red-500" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-xl font-bold text-red-400">Accommodation is Closed</h3>
                                                            <p className="text-gray-400 max-w-sm mx-auto">
                                                                Online accommodation booking is currently disabled. Please contact the organizers for more information.
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : accommodationsFull ? (
                                                    <div className="text-center py-10 text-base sm:text-sm text-red-400">
                                                        Accommodation is currently full. Please check back later.
                                                    </div>
                                                ) : !user ? (
                                                    <div className="text-center py-10 space-y-3">
                                                        <p className="text-gray-400">You need to log in to book accommodation.</p>
                                                        <a
                                                            href={`${import.meta.env.VITE_AUTH_URL}/?redirect=${encodeURIComponent(window.location.href)}`}
                                                            className="inline-block px-6 py-2 bg-[#5b21b6] hover:bg-[#4c1d95] text-white rounded-md transition-all duration-300 skew-x-[-10deg] cursor-target"
                                                        >
                                                            <span className="block skew-x-10">Login to Continue</span>
                                                        </a>
                                                    </div>
                                                ) : (user.category === 'INTERNAL' || user.category === 'ALUMNI') ? (
                                                    <div className="text-center py-10 space-y-3 text-amber-400">
                                                        <p>Accommodation is currently provided only for external participants.</p>
                                                        <p className="text-sm text-gray-500">Internal students can stay in their respective hostels.</p>
                                                    </div>
                                                ) : !user?.pid ? (
                                                    <div className="text-center py-10 space-y-3">
                                                        <p className="text-red-400">You need to register to Incridea first to book accommodation.</p>
                                                        <Link to="/register" className="inline-block px-6 py-2 bg-[#5b21b6] hover:bg-[#4c1d95] text-white rounded-md transition-all duration-300 skew-x-[-10deg] cursor-target">
                                                            <span className="block skew-x-10">Register for Incridea</span>
                                                        </Link>
                                                    </div>
                                                ) : bookingData && bookingData.PaymentOrder && (bookingData.PaymentOrder.status === 'SUCCESS' || bookingData.PaymentOrder.status === 'PENDING') ? (
                                                    <div className="text-center py-10 text-green-400 font-medium text-xl sm:text-lg">
                                                        You already have done the booking for your accommodation
                                                    </div>
                                                ) : (
                                                    <IndividualBookingForm onSuccess={() => refetch()} />
                                                )}
                                            </motion.div>
                                        </div>
                                    </LiquidGlassCard>
                                </div>
                            </div>

                            <div className="w-full mt-8">
                                <LiquidGlassCard className="p-6">
                                    <h2 className="text-3xl sm:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                        Types of Accommodation
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-8 text-gray-300">
                                        {/* Internal Accommodation Info */}
                                        <div>
                                            <h3 className="text-2xl sm:text-xl font-semibold mb-4 text-purple-400">
                                                1) Internal Accommodation
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold text-white mb-2">Charges:</h4>
                                                    <ul className="list-disc list-outside pl-5 space-y-2">
                                                        <li><strong>For Students:</strong> ₹250 per day per student</li>
                                                        <li><strong>For Faculty:</strong> ₹300 per day per person</li>
                                                    </ul>
                                                </div>
                                                <ul className="list-disc list-outside pl-5 space-y-2">
                                                    <li>Hostels will be provided for both boys and girls.</li>
                                                    <li>Food will not be provided in the hostel. Students need to arrange their own food.</li>
                                                    <li>Nearby restaurants details will be shared for convenience. After the program ends restaurant will be requested to stay open.</li>
                                                    <li>Registration will be on a <strong>first come first serve</strong> basis.</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* External Accommodation Info */}
                                        <div>
                                            <h3 className="text-2xl sm:text-xl font-semibold mb-4 text-purple-400">
                                                2) External Accommodation
                                            </h3>
                                            <ul className="list-disc list-outside pl-5 space-y-3">
                                                <li>A list of nearby Hotels within a 5km to 10km radius will be provided for students to book directly.</li>
                                                <li>Students opting for external accommodation need to book the hotels directly by themselves.</li>
                                                <li>Students opting for external accommodation need to arrange their own transportation.</li>
                                                <li>College buses will be available at night in a specific timings to drop students back to locations.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </LiquidGlassCard>
                            </div>

                            <div className="w-full mt-8">
                                <LiquidGlassCard className="p-6">
                                    <h2 className="text-3xl sm:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                        Terms and Conditions
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-2xl sm:text-xl font-semibold mb-4">
                                                Rules for Accommodation (Boys)
                                            </h3>
                                            <ul className="list-decimal list-outside pl-5 space-y-3 text-base sm:text-sm text-gray-300">
                                                <li>Main Boys Hostel is assigned for boys</li>
                                                <li>Hostels will be closed within 30 minutes from the time the program ends at night. Students are requested to strictly follow the timings.</li>
                                                <li>Rooms provided will be of 2 or 3 sharing system.</li>
                                                <li>Consumption of alcohol or any similar substances is strictly prohibited and strict action will be taken if found guilty of the same.</li>
                                                <li>If found guilty of damaging any of the resources or property of college strict action will be taken.</li>
                                                <li>Participants are advised to bring their own locks to ensure the protection of their belongings in the rooms.</li>
                                                <li>Do not litter the rooms provided.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl sm:text-xl font-semibold mb-4">
                                                Rules for Accommodation (Girls)
                                            </h3>
                                            <ul className="list-decimal list-outside pl-5 space-y-3 text-base sm:text-sm text-gray-300">
                                                <li>EDC Block (Dormitory) and Girls Hostel is assigned for girls, which will be closed within 30 minutes from the time the programs end at Night.</li>
                                                <li>Hostel Rooms provided will be of 2 or 3-sharing system. </li>
                                                <li>A dormitory (EDC Block) is also available with a capacity of 20. Charges are same </li>
                                                <li>Consumption of alcohol or any similar substances is strictly prohibited and will result in severe consequences being taken.</li>
                                                <li>The security will open EDC dormitory at 6 am in the morning, so if you want anything during the night time, you cannot go out and hence it is advised to carry the necessary things well in advance.</li>
                                                <li>Do not damage the resources provided from college. If found guilty, strict action will be taken.</li>
                                                <li>Participants are advised to bring their own locks to ensure the protection of their belongings in the rooms.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </LiquidGlassCard>
                            </div>
                        </>
                    ) : (
                        <div className="w-full">
                            <ExternalAccommodationList />
                            <LiquidGlassCard className="p-6 mt-8">
                                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                    Important Information
                                </h2>
                                <ul className="list-disc list-outside pl-5 space-y-3 text-gray-300">
                                    <li>A list of nearby Hotels within a 5km to 10km radius will be provided for students to book directly.</li>
                                    <li>Students opting for external accommodation need to book the hotels directly by themselves.</li>
                                    <li>Students opting for external accommodation need to arrange their own transportation.</li>
                                    <li>College buses will be available at night in a specific timings to drop students back to locations.</li>
                                </ul>
                            </LiquidGlassCard>
                        </div>
                    )}

                    <div className="w-full mt-12 pb-8">
                        <LiquidGlassCard className="p-6">
                            <h2 className="text-2xl sm:text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 text-center">
                                For Queries Contact
                            </h2>
                            <div className="flex flex-col md:flex-row gap-6 justify-around text-center">
                                <div>
                                    <h3 className="text-lg sm:text-base font-semibold text-gray-200">Ansh P Bhandary</h3>
                                    <a href="tel:+919611878045" className="text-purple-400 hover:text-purple-300 mt-1 inline-block">+91 9611878045</a>
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-base font-semibold text-gray-200">Vinush</h3>
                                    <a href="tel:+917349112989" className="text-purple-400 hover:text-purple-300 mt-1 inline-block">+91 73491 12989</a>
                                </div>
                            </div>
                        </LiquidGlassCard>
                    </div>
                </div>
            )}
        </div>
    )
}

function ExternalAccommodationList() {
    const { data: externalAccommodations, isLoading } = useQuery({
        queryKey: ['externalAccommodations'],
        queryFn: async () => {
            try {
                return await import('../api/accommodation').then(m => m.getExternalAccommodations())
            } catch (e) {
                return []
            }
        }
    })

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        )
    }

    if (!externalAccommodations || externalAccommodations.length === 0) {
        return (
            <LiquidGlassCard className="p-8 text-center text-base sm:text-sm text-gray-400">
                <h3 className="text-xl font-semibold mb-2">No External Accommodations Found</h3>
                <p>Please check back later for more options.</p>
            </LiquidGlassCard>
        )
    }

    return (
        <LiquidGlassCard className="overflow-hidden">
            <div className="w-full">
                {/* Mobile Card Layout */}
                <div className="grid grid-cols-1 gap-4 p-4 md:hidden max-w-sm mx-auto w-full">
                    {externalAccommodations.map((acc: any) => (
                        <div key={acc.id} className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/10">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-lg text-white">{acc.name}</h4>
                                <a
                                    href={acc.mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-purple-400 transition-colors shrink-0"
                                    title="View on Map"
                                >
                                    <MapPin className="w-4 h-4" />
                                </a>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">Max Sharing</span>
                                    <span className="text-gray-200">{acc.maxSharing}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">Phone</span>
                                    <a href={`tel:${acc.phoneNumber}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                                        {acc.phoneNumber}
                                    </a>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-white/10">
                                <span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">Price / Day</span>
                                <span className="text-green-400 font-medium whitespace-pre-line">{acc.priceDetails}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Max Sharing</th>
                                <th className="p-4 font-semibold">Price / Day</th>
                                <th className="p-4 font-semibold">Phone</th>
                                <th className="p-4 font-semibold text-right">Map</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm text-gray-300">
                            {externalAccommodations.map((acc: any) => (
                                <tr key={acc.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{acc.name}</td>
                                    <td className="p-4">{acc.maxSharing}</td>
                                    <td className="p-4 text-green-400 font-medium whitespace-pre-line">{acc.priceDetails}</td>
                                    <td className="p-4">
                                        <a href={`tel:${acc.phoneNumber}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                                            {acc.phoneNumber}
                                        </a>
                                    </td>
                                    <td className="p-4 text-right">
                                        <a
                                            href={acc.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-purple-400 transition-colors"
                                            title="View on Map"
                                        >
                                            <MapPin className="w-4 h-4" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </LiquidGlassCard>
    )
}
