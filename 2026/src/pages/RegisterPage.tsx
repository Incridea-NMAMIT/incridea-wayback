import { useEffect, useMemo, useState, Suspense, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { fetchRegistrationConfig, fetchColleges, type RegistrationConfigResponse } from '../api/public'
import { initiatePayment, verifyPaymentSignature } from '../api/registration'
import { fetchMe } from '../api/auth'
import { showToast } from '../utils/toast'
import PaymentProcessingModal from '../components/PaymentProcessingModal'
import LiquidGlassCard from '../components/liquidglass/LiquidGlassCard'
import SEO from '../components/SEO'


import TShirt3DModel from "../components/merch/TShirt3DModel";
import SizeChart from "../components/merch/SizeChart";
import LightRays from "@/components/LightRays";
import { isInAppBrowser } from "../utils/browser";

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
`;


function RegisterPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('token')) {
            window.history.replaceState({}, '', window.location.pathname)
        }
    }, [])

    const { data: userData, isLoading: isUserLoading, isError: isUserError, refetch: refetchUser } = useQuery({
        queryKey: ['me'],
        queryFn: fetchMe,
        retry: false,
    })




    useEffect(() => {
        if (!isUserLoading && !userData) {
            window.location.href = `${import.meta.env.VITE_AUTH_URL}/?redirect=${encodeURIComponent(window.location.href)}`
            return
        }

        if (!isUserLoading && isUserError) {
            window.location.href = `${import.meta.env.VITE_AUTH_URL}/?redirect=${encodeURIComponent(window.location.href)}`
        }
    }, [isUserLoading, isUserError])

    const user = userData?.user

    const [modalState, setModalState] = useState<{
        isOpen: boolean
        status: 'SUCCESS' | 'FAILED' | 'PENDING'
        pid?: string | null
    }>({
        isOpen: false,
        status: 'PENDING',
        pid: null,
    })

    useEffect(() => {
        if (user?.pid && !modalState.isOpen) {
            navigate('/')
        }
    }, [user?.pid, modalState.isOpen, navigate])

    const { data: registrationConfig, isLoading: isConfigLoading } = useQuery<RegistrationConfigResponse>({
        queryKey: ['registration-config'],
        queryFn: fetchRegistrationConfig,
    })

    const { isSpotRegistration, enforceCommittee, enforceOrg, enforceBR, allowAlumniMerch, merchOpen } = registrationConfig || {}

    useQuery({
        queryKey: ['colleges'],
        queryFn: fetchColleges,
    })


    const [registrationOption, setRegistrationOption] = useState('')
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [isPaymentInitiating, setIsPaymentInitiating] = useState(false)
    const isProcessingRef = useRef(false)

    // Merch State
    const [includeMerch, setIncludeMerch] = useState(true)
    const [merchSize, setMerchSize] = useState('')
    const [merchYear, setMerchYear] = useState('')

    const isInternal = user?.category === 'INTERNAL'
    const isNMAMIT = user?.collegeId === 1
    const isAlumni = user?.category === 'ALUMNI'
    const alumniStatus = user?.alumniStatus

    useEffect(() => {
        const isMerchAvailable = merchOpen || (isAlumni && allowAlumniMerch);
        if (user?.isMerchPurchased || !isMerchAvailable) {
            setIncludeMerch(false)
        }
    }, [user?.isMerchPurchased, merchOpen, isAlumni, allowAlumniMerch])

    const [merchSection, setMerchSection] = useState('')
    const [merchBranch, setMerchBranch] = useState('') // Used for Branch (NMAMIT) or Dept (Others)
    const [merchUSN, setMerchUSN] = useState('')
    const [isOtherBranch, setIsOtherBranch] = useState(false)

    const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

    const computedSelection = useMemo(() => {
        if (!user) return 'OTHER';
        if (user.collegeId === 1) return 'NMAMIT';
        return 'OTHER';
    }, [user]);

    const isCommitteeMember = useMemo(() => {
        if (!user) return false;
        return (
            (user.committeeRole && user.committeeRole !== 'NONE') ||
            (user.HeadOfCommittee && user.HeadOfCommittee.length > 0) ||
            (user.CoHeadOfCommittee && user.CoHeadOfCommittee.length > 0)
        )
    }, [user])

    const feeOptions = useMemo(() => {
        if (!registrationConfig) return []
        const { fees, isRegistrationOpen, isSpotRegistration } = registrationConfig

        if (!isRegistrationOpen) return []

        let options = []

        if (isAlumni) {
            options = [
                {
                    id: 'alumni-pass',
                    label: 'Alumni Registration',
                    amount: fees.alumniRegistrationFee,
                },
            ]
        } else if (computedSelection === 'NMAMIT') {
            if (isSpotRegistration) {
                options = [
                    {
                        id: 'internal-onspot',
                        label: 'On spot registration',
                        amount: Number(fees.internalRegistrationOnSpot) || 0,
                    },
                ]
            } else {
                options = [
                    {
                        id: 'internal-pass',
                        label: 'Dimensional Pass',
                        amount: fees.internalRegistrationFeeGen,
                        note: 'All Events Pass + Pronite Entry Complimentary'
                    }
                ];
                if (registrationConfig.twoPassReg) {
                    options.push({
                        id: 'events-only',
                        label: 'Orbit Pass',
                        amount: fees.eventsOnlyRegistrationFee,
                        note: 'Registration allowed to only 3 events (No Pronite Entry) - Upgradable'
                    });
                }
            }
        } else {
            if (isSpotRegistration) {
                options = [
                    {
                        id: 'external-onspot',
                        label: 'On spot registration',
                        amount: fees.externalRegistrationFeeOnSpot,
                    },
                ]
            } else {
                options = [
                    {
                        id: 'external-early',
                        label: 'Dimensional Pass',
                        amount: fees.externalRegistrationFee,
                        note: 'All Events Pass + Pronite Entry Complimentary'
                    }
                ];
                if (registrationConfig.twoPassReg) {
                    options.push({
                        id: 'events-only',
                        label: 'Orbit Pass',
                        amount: fees.eventsOnlyRegistrationFee,
                        note: 'Registration allowed to only 3 events (No Pronite Entry) - Upgradable'
                    });
                }
            }
        }

        return options
    }, [registrationConfig, computedSelection, isAlumni])

    const selectedFee = useMemo(() => {
        return feeOptions.find(o => o.id === registrationOption)
    }, [feeOptions, registrationOption])



    const isMerchMandatory = useMemo(() => {
        if (!user) return false;
        if (user.category === 'ALUMNI') return false; // Alumni merch is never strictly mandatory for registration
        if (user.hasMerchOrder || user.isMerchPurchased) return false;

        // If merch is closed, it can't be mandatory
        const isMerchAvailable = merchOpen || (isAlumni && allowAlumniMerch);
        if (!isMerchAvailable) return false;

        return (
            (enforceCommittee && isCommitteeMember) ||
            (enforceOrg && user.isOrganiser) ||
            (enforceBR && user.isBranchRep)
        )
    }, [user, isCommitteeMember, enforceCommittee, enforceOrg, enforceBR, merchOpen, isAlumni, allowAlumniMerch])

    useEffect(() => {
        if (isMerchMandatory && isInternal && !isAlumni && !user?.isMerchPurchased) {
            setIncludeMerch(true)
        }
    }, [isMerchMandatory, isInternal, isAlumni, user?.isMerchPurchased])

    useEffect(() => {
        if (registrationConfig) {
            if (isAlumni) {
                setRegistrationOption('alumni-pass')
            } else if (isSpotRegistration) {
                setRegistrationOption(computedSelection === 'NMAMIT' ? 'internal-onspot' : 'external-onspot')
            } else if (computedSelection === 'NMAMIT') {
                setRegistrationOption('internal-pass')
            } else if (!registrationConfig.twoPassReg) {
                setRegistrationOption('external-early')
            }
        }
    }, [registrationConfig, computedSelection, isSpotRegistration, isAlumni])

    const pricingBreakdown = useMemo(() => {
        if (!selectedFee) return null
        let base = Number(selectedFee.amount)
        let merchAmount = 0

        if (includeMerch && ((isInternal && !isAlumni) || (isAlumni && allowAlumniMerch))) {
            let merchPrice = Number(registrationConfig?.fees?.merchTshirtPrice) || 230;
            if (merchSize === '3XL') merchPrice += 10;
            if (merchSize === '4XL') merchPrice += 20;

            merchAmount = merchPrice;
        }

        const taxRate = 0.0236
        // Server formula: Amount / (1 - rate)
        const baseWithTax = Math.ceil(base / (1 - taxRate))
        const taxAmount = baseWithTax - base
        const total = Math.ceil(baseWithTax + merchAmount)

        return {
            base,
            merch: merchAmount,
            tax: taxAmount,
            total
        }
    }, [selectedFee, includeMerch, registrationConfig, isInternal, merchSize])

    const isMerchDetailsComplete = useMemo(() => {
        if (user?.isMerchPurchased) return true
        if (!(includeMerch && ((isInternal && !isAlumni) || (isAlumni && allowAlumniMerch)))) return true

        const hasSize = Boolean(merchSize)

        if (isAlumni) return hasSize

        if (isNMAMIT) {
            return hasSize && Boolean(merchYear) && Boolean(merchBranch.trim()) && Boolean(merchSection.trim()) && Boolean(merchUSN.trim())
        }

        return hasSize && Boolean(merchBranch.trim()) && Boolean(merchYear)
    }, [includeMerch, isInternal, isNMAMIT, merchSize, merchYear, merchBranch, merchSection, merchUSN])

    const handlePayment = async () => {
        if (!registrationOption || !termsAccepted || isPaymentInitiating || isProcessingRef.current) return

        if (includeMerch && ((isInternal && !isAlumni) || (isAlumni && allowAlumniMerch)) && !user?.isMerchPurchased) {
            if (!merchSize) {
                showToast('Please select a T-Shirt size', 'error')
                return
            }

            if (!isAlumni) {
                if (isNMAMIT) {
                    if (!merchUSN || merchUSN.trim().length < 8) {
                        showToast('USN must be at least 8 characters', 'error')
                        return
                    }
                    if (!merchBranch || !merchYear || !merchSection) {
                        showToast('Please enter your Branch, Year, and Section', 'error')
                        return
                    }
                } else {
                    if (!merchBranch || !merchYear) { // Reusing branch state for Dept
                        showToast('Please enter your Department and Year', 'error')
                        return
                    }
                }
            }
        }

        isProcessingRef.current = true
        setIsPaymentInitiating(true)

        const loadScript = (src: string) => {
            return new Promise((resolve) => {
                const script = document.createElement('script')
                script.src = src
                script.onload = () => resolve(true)
                script.onerror = () => resolve(false)
                document.body.appendChild(script)
            })
        }

        try {
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
            if (!res) {
                showToast('Razorpay SDK failed to load', 'error')
                setIsPaymentInitiating(false)
                isProcessingRef.current = false
                return
            }

            const data = await initiatePayment(registrationOption, {
                includeMerch: (includeMerch && ((isInternal && !isAlumni) || (isAlumni && allowAlumniMerch))),
                size: (includeMerch && ((isInternal && !isAlumni) || (isAlumni && allowAlumniMerch))) ? merchSize : undefined,
                year: (includeMerch && isInternal && !isAlumni) ? merchYear : undefined,
                section: (includeMerch && isInternal && isNMAMIT && !isAlumni) ? merchSection : undefined,
                branch: (includeMerch && isInternal && isNMAMIT && !isAlumni) ? merchBranch : undefined,
                usn: (includeMerch && isInternal && isNMAMIT && !isAlumni) ? merchUSN : undefined,
                dept: (includeMerch && isInternal && !isNMAMIT && !isAlumni) ? merchBranch : undefined // Using branch state for Dept input
            })

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "Incridea'26 - Registration",
                description: 'Fest Registration',
                order_id: data.orderId,
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phoneNumber
                },
                theme: {
                    color: '#460c78'
                },
                handler: async function (response: any) {
                    setModalState({
                        isOpen: true,
                        status: 'PENDING',
                    })
                    setIsPaymentInitiating(false)
                    isProcessingRef.current = false

                    try {
                        await verifyPaymentSignature(response)
                    } catch (error) {
                        console.error('Payment verification request failed', error)
                        setModalState({
                            isOpen: true,
                            status: 'FAILED',
                            pid: null,
                        })
                    }
                },
                modal: {
                    ondismiss: async function () {
                        setModalState((prev) => ({ ...prev, isOpen: true, status: 'PENDING', pid: null }))
                        setIsPaymentInitiating(false)
                        isProcessingRef.current = false
                        const { data: updatedUser } = await refetchUser()
                        if (updatedUser?.user?.pid) {
                            setModalState({
                                isOpen: true,
                                status: 'SUCCESS',
                                pid: updatedUser.user.pid,
                            })
                        } else {
                            setModalState({
                                isOpen: true,
                                status: 'FAILED',
                                pid: null,
                            })
                        }
                    },
                },
            }

            const paymentObject = new (window as any).Razorpay(options)
            paymentObject.on('payment.failed', function (response: any) {
                showToast(response.error.description || 'Payment Failed', 'error')
                setIsPaymentInitiating(false)
                isProcessingRef.current = false
            })
            paymentObject.open()

        } catch (err: any) {
            console.error(err)
            showToast(err.response?.data?.message || 'Error initiating payment', 'error')
            setIsPaymentInitiating(false)
            isProcessingRef.current = false
            setModalState({
                isOpen: true,
                status: 'FAILED',
                pid: null,
            })
        }
    }


    if (isUserLoading || isConfigLoading) {
        return <div className="p-8 text-center text-slate-400">Loading...</div>
    }

    if (registrationConfig && !registrationConfig.isRegistrationOpen) {
        return (
            <section className="space-y-4 max-w-2xl mx-auto p-4">
                <SEO title="Register" description="Register for Incridea 2026, the national level techno-cultural fest of NMAM Institute of Technology, Nitte." />
                <LiquidGlassCard className="p-6">
                    <p className="muted mb-2">Registration</p>
                    <h1 className="text-2xl text-slate-50 font-moco font-bold">Register Incridea</h1>
                    <p className="mt-2 text-slate-300">Registrations are not open yet. Please check back soon.</p>
                </LiquidGlassCard>
            </section>
        )
    }

    if (user?.category === 'SERVICE') {
        return (
            <section className="space-y-4 max-w-2xl mx-auto p-4">
                <SEO title="Register" description="Register for Incridea 2026, the national level techno-cultural fest of NMAM Institute of Technology, Nitte." />
                <LiquidGlassCard className="p-6">
                    <p className="muted mb-2">Registration</p>
                    <h1 className="text-2xl text-slate-50 font-moco font-bold">Register Incridea</h1>
                    <p className="mt-2 text-slate-300">SERVICE accounts do not participate in fest registrations.</p>
                </LiquidGlassCard>
            </section>
        )
    }

    return (
        <>
            <SEO
                title="Register"
                description="Register for Incridea'26 and participate in over 50+ events."
                url="/register"
            />
            <div className="relative min-h-screen w-full overflow-hidden perspective-1000">

                <style>{styles}</style>
                <section className="relative max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                    <div className="mb-8 flex flex-col justify-center items-center">
                        <h1 className="text-3xl sm:text-4xl text-slate-50 font-moco font-bold">Incridea Registration</h1>
                        <p className="px-3 py-1 rounded-md bg-slate-950/60 backdrop-blur-smtext-lg sm:text-sm text-slate-100 font-medium mt-2 px-3 py-1 rounded-md bg-slate-950/60 backdrop-blur-sm">Confirm your details and complete payment to register to Incridea '26'.</p>
                    </div>

                    <LiquidGlassCard className="p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 md:p-8">
                            { }
                            <div className="space-y-6 h-fit">
                                <div>
                                    <h2 className="text-3xl sm:text-xl text-slate-100 mb-4 font-moco font-bold">Your Details</h2>
                                    <div className="space-y-4 text-sm">
                                        <div className="space-y-2 font-mono text-base sm:text-sm pl-2">
                                            <div className="flex flex-col sm:flex-row sm:gap-2">
                                                <span className="text-white font-outfit min-w-[80px] text-base sm:text-sm">Name :</span>
                                                <span className="text-white font-outfit">{user?.name}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:gap-2">
                                                <span className="text-white font-outfit min-w-[80px] text-base sm:text-sm">Email :</span>
                                                <span className="text-white font-outfit">{user?.email}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:gap-2">
                                                <span className="text-white font-outfit min-w-[80px] text-base sm:text-sm">Contact :</span>
                                                <span className="text-white font-outfit">{user?.phoneNumber || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:gap-2">
                                                <span className="text-white font-outfit min-w-[80px] text-base sm:text-sm">College :</span>
                                                <span className="text-white font-outfit">{user?.college || 'Unknown College'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {isInternal && !isAlumni && !user?.isMerchPurchased && merchOpen && (
                                    <div className="pt-6 border-t border-slate-800 pb-6 mb-6">
                                        <div className="flex flex-col items-start gap-3 mb-4">
                                            <h2 className="text-2xl sm:text-xl text-slate-100 font-moco font-bold">Incridea Merchandise</h2>
                                        </div>

                                        {/* 3D Model Preview */}
                                        <div className="relative h-[300px] w-full rounded-xl overflow-hidden border border-slate-700/50">
                                            <div className="absolute inset-0 mix-blend-screen brightness-125">
                                                <LightRays
                                                    raysOrigin="top-center"
                                                    raysSpeed={0.5}
                                                    lightSpread={0.6}
                                                    rayLength={1.2}
                                                    raysColor="#ffffff"
                                                    followMouse={true}
                                                />
                                            </div>
                                            <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Loading Model...</div>}>
                                                <TShirt3DModel modelPath="/models/tshirt.glb" scale={0.8} />
                                            </Suspense>
                                        </div>
                                    </div>
                                )}
                            </div>

                            { }
                            <div className="space-y-6 flex flex-col h-fit relative lg:pl-12 lg:border-l border-slate-800">


                                {(isAlumni && alumniStatus === 'PENDING') ? (
                                    <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                        <h3 className="text-xl text-yellow-500 font-bold mb-2">Verification Pending</h3>
                                        <p className="text-slate-300">Your Alumni status is not verified yet. Please wait for some time.</p>
                                    </div>
                                ) : (isAlumni && alumniStatus === 'DECLINED') ? (
                                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <h3 className="text-xl text-red-500 font-bold mb-2">Verification Declined</h3>
                                        <p className="text-slate-300 mb-4">Your alumni status was declined. If you think we did a mistake, Please contact us.</p>
                                        <a href="/contact" className="text-sky-400 hover:text-sky-300 hover:underline">Contact Us</a>
                                    </div>
                                ) : (isAlumni && !alumniStatus) ? (
                                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <h3 className="text-xl text-red-500 font-bold mb-2">Alumni Record Missing</h3>
                                        <p className="text-slate-300 mb-4">We could not find your Alumni details. If you think this is a mistake, Please contact us.</p>
                                        <a href="/contact" className="text-sky-400 hover:text-sky-300 hover:underline">Contact Us</a>
                                    </div>
                                ) : (
                                    <>
                                        {/* Registration Option Selection */}
                                        {feeOptions.length > 1 && (
                                            <div className="mb-6">
                                                <h2 className="text-xl sm:text-lg text-slate-100 font-moco font-bold mb-4">Select Registration Type</h2>
                                                <div className="space-y-3">
                                                    {feeOptions.map((option) => (
                                                        <label
                                                            key={option.id}
                                                            className={`relative flex items-start p-4 cursor-pointer rounded-lg border transition-all ${registrationOption === option.id
                                                                ? 'border-sky-500 bg-sky-500/10'
                                                                : 'border-slate-800 bg-black/40 hover:border-slate-700'
                                                                }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="registrationOption"
                                                                value={option.id}
                                                                checked={registrationOption === option.id}
                                                                onChange={(e) => setRegistrationOption(e.target.value)}
                                                                className="hidden"
                                                            />
                                                            <div className={`mt-0.5 mr-3 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${registrationOption === option.id
                                                                ? 'border-sky-500'
                                                                : 'border-slate-600'
                                                                }`}>
                                                                {registrationOption === option.id && (
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 flex flex-col">
                                                                <div className="flex justify-between">
                                                                    <span className={`font-medium ${registrationOption === option.id ? 'text-white' : 'text-slate-300'}`}>
                                                                        {option.label}
                                                                    </span>
                                                                    <span className="text-slate-200 font-bold">
                                                                        ₹ {Number(option.amount).toFixed(0)}
                                                                    </span>
                                                                </div>
                                                                {(option as any).note && (
                                                                    <p className={`text-xs mt-1 ${option.id === 'events-only' ? 'text-amber-400' : 'text-slate-100'}`}>{(option as any).note}</p>
                                                                )}
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Merch Model and Checkbox moved here */}
                                        <div className="pt-4 border-b border-slate-800 pb-6 mb-6">
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <div className="relative flex items-center mt-0.5">
                                                    <input
                                                        type="checkbox"
                                                        className="peer h-5 w-5 appearance-none rounded border bg-black border-slate-600 checked:border-sky-500 checked:bg-sky-500 transition-colors"
                                                        checked={termsAccepted}
                                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                                    />
                                                    <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div className="text-lg sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                                    I agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 hover:underline">Terms and Conditions</a>, <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 hover:underline">Privacy Policy</a>, and <a href="/refund-policy" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 hover:underline">Refund Policy</a> of Incridea.
                                                </div>
                                            </label>
                                            {!merchOpen && !isAlumni && (
                                                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
                                                    <p className="text-amber-400 text-xs font-medium">
                                                        <span className="font-bold">Note:</span> Merchandise bookings are currently closed. You can still register for the fest without merchandise.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {includeMerch && ((isInternal && !isAlumni) || (isAlumni && allowAlumniMerch)) && !user?.isMerchPurchased && merchOpen && (
                                            <div className="pt-6 border-b border-slate-800 pb-6 mb-6">
                                                <h2 className="text-xl sm:text-lg text-slate-100 font-moco font-bold mb-4">Merch Details</h2>
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 mb-6">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-sm sm:text-xs text-slate-400 uppercase tracking-wider">Size</label>
                                                            <select
                                                                value={merchSize}
                                                                onChange={(e) => setMerchSize(e.target.value)}
                                                                required={includeMerch && ((isInternal && !isAlumni) || (isAlumni && allowAlumniMerch))}
                                                                className="w-full bg-black border border-slate-700 rounded p-2 text-slate-200 focus:border-sky-500 outline-none transition-colors"
                                                            >
                                                                <option value="" disabled className="bg-black">Select Size</option>
                                                                {sizes.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                                                            </select>
                                                        </div>

                                                    </div>

                                                    <SizeChart />

                                                    {!isAlumni && (
                                                        <>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <label className="text-sm sm:text-xs text-slate-400 uppercase tracking-wider">{isNMAMIT ? 'Semester' : 'Year'}</label>
                                                                    {isNMAMIT ? (
                                                                        <select
                                                                            value={merchYear}
                                                                            onChange={(e) => setMerchYear(e.target.value)}
                                                                            required={includeMerch && isInternal && isNMAMIT && !isAlumni}
                                                                            className="w-full bg-black border border-slate-700 rounded p-2 text-slate-200 focus:border-sky-500 outline-none transition-colors"
                                                                        >
                                                                            <option value="" disabled className="bg-black">Select Sem</option>
                                                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                                                                        </select>
                                                                    ) : (
                                                                        <input
                                                                            type="number"
                                                                            value={merchYear}
                                                                            onChange={(e) => setMerchYear(e.target.value)}
                                                                            placeholder="e.g. 1, 2, 3, 4"
                                                                            min="1"
                                                                            max="4"
                                                                            required={includeMerch && isInternal && !isAlumni}
                                                                            className="w-full bg-black border border-slate-700 rounded p-2 text-slate-200 focus:border-sky-500 outline-none transition-colors"
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div className="space-y-1">
                                                                    <label className="text-sm sm:text-xs text-slate-400 uppercase tracking-wider">{isNMAMIT ? 'Branch' : 'Department'}</label>
                                                                    {isNMAMIT ? (
                                                                        <>
                                                                            <select
                                                                                value={isOtherBranch ? 'Other' : merchBranch}
                                                                                onChange={(e) => {
                                                                                    const val = e.target.value;
                                                                                    if (val === 'Other') {
                                                                                        setIsOtherBranch(true);
                                                                                        setMerchBranch('');
                                                                                    } else {
                                                                                        setIsOtherBranch(false);
                                                                                        setMerchBranch(val);
                                                                                    }
                                                                                }}
                                                                                required={includeMerch && isInternal && !isAlumni}
                                                                                className="w-full bg-black border border-slate-700 rounded p-2 text-slate-200 focus:border-sky-500 outline-none transition-colors"
                                                                            >
                                                                                <option value="" disabled className="bg-black">Select Branch</option>
                                                                                {[
                                                                                    "Artificial Intelligence & Data Science",
                                                                                    "Artificial Intelligence & Machine Learning",
                                                                                    "Biotechnology",
                                                                                    "Civil Engineering",
                                                                                    "Computer & Communication Engineering",
                                                                                    "Computer Science & Engineering",
                                                                                    "Computer Science & Engineering (Cyber Security)",
                                                                                    "Electrical & Electronics Engineering",
                                                                                    "Electronics & Communication Engineering",
                                                                                    "Electronics Engineering (VLSI Design & Technology)",
                                                                                    "Electronics & Communication (Advanced Communication Technology)",
                                                                                    "Information Science & Engineering",
                                                                                    "Robotics & Artificial Intelligence",
                                                                                    "Mechanical Engineering"
                                                                                ].map(b => (
                                                                                    <option key={b} value={b} className="bg-black">{b}</option>
                                                                                ))}
                                                                            </select>
                                                                            {isOtherBranch && (
                                                                                <input
                                                                                    type="text"
                                                                                    value={merchBranch}
                                                                                    onChange={(e) => setMerchBranch(e.target.value)}
                                                                                    placeholder="Type your branch"
                                                                                    required={includeMerch && isInternal && isOtherBranch && !isAlumni}
                                                                                    className="w-full bg-black border border-slate-700 rounded p-2 text-slate-200 focus:border-sky-500 outline-none transition-colors mt-2 animate-in fade-in slide-in-from-top-2"
                                                                                />
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <input
                                                                            type="text"
                                                                            value={merchBranch}
                                                                            onChange={(e) => setMerchBranch(e.target.value)}
                                                                            placeholder="e.g. MCA"
                                                                            required={includeMerch && isInternal && !isAlumni}
                                                                            className="w-full bg-black border border-slate-700 rounded p-2 text-slate-200 focus:border-sky-500 outline-none transition-colors"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {isNMAMIT && (
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                                                    <div className="space-y-1">
                                                                        <label className="text-sm sm:text-xs text-slate-400 uppercase tracking-wider">Section</label>
                                                                        <select
                                                                            value={merchSection}
                                                                            onChange={(e) => setMerchSection(e.target.value)}
                                                                            required={includeMerch && isInternal && isNMAMIT && !isAlumni}
                                                                            className="w-full bg-black border border-slate-700 rounded p-2 text-slate-200 focus:border-sky-500 outline-none transition-colors"
                                                                        >
                                                                            <option value="" disabled className="bg-black">Select Section</option>
                                                                            {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(s => (
                                                                                <option key={s} value={s} className="bg-black">{s}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="text-sm sm:text-xs text-slate-400 uppercase tracking-wider">USN</label>
                                                                        <input
                                                                            type="text"
                                                                            value={merchUSN}
                                                                            onChange={(e) => setMerchUSN(e.target.value.toUpperCase())}
                                                                            placeholder="e.g. 4NM..."
                                                                            required={includeMerch && isInternal && isNMAMIT && !isAlumni}
                                                                            minLength={8}
                                                                            maxLength={10}
                                                                            className="w-full bg-black border border-slate-700 rounded p-2 text-slate-200 focus:border-sky-500 outline-none transition-colors"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                        )}

                                        {pricingBreakdown ? (
                                            <div className="space-y-4">
                                                <div className="rounded-lg p-4 border border-slate-800 space-y-3">
                                                    <div className="flex justify-between items-center text-base sm:text-sm text-slate-300">
                                                        <div className="flex flex-col">
                                                            <span>{selectedFee?.label}</span>
                                                            {(selectedFee as any)?.note && (
                                                                <span className={`text-xs mt-1 ${selectedFee?.id === 'events-only' ? 'text-amber-400' : 'text-slate-100'}`}>{(selectedFee as any)?.note}</span>
                                                            )}
                                                        </div>
                                                        <span>₹ {Number(selectedFee?.amount || 0).toFixed(2)}</span>
                                                    </div>
                                                    {((isInternal && !isAlumni && merchOpen) || (isAlumni && allowAlumniMerch)) && !user?.isMerchPurchased && (
                                                        <>
                                                            {isAlumni && includeMerch && (
                                                                <div className="mb-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded">
                                                                    <p className="text-amber-400 text-xs font-medium">
                                                                        Note: T-Shirts for Alumni will be available for collection on 5th March on or before 4:00 PM.
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between items-center text-base sm:text-sm text-slate-300">
                                                                <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                                                    <div className="relative flex items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={includeMerch}
                                                                            onChange={(e) => setIncludeMerch(e.target.checked)}
                                                                            className="peer h-4 w-4 appearance-none rounded border border-slate-600 checked:border-sky-500 checked:bg-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            disabled={isMerchMandatory}
                                                                        />
                                                                        <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                    <span>Incridea T-Shirt {isMerchMandatory && <span className="text-[10px] text-amber-400 ml-1">(Mandatory)</span>}</span>
                                                                </label>
                                                                <span>₹ {pricingBreakdown.merch.toFixed(2)}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className="flex justify-between items-center text-base sm:text-sm text-slate-400">
                                                        <span>Tax & Gateway Charges (2.36% on Reg.)</span>
                                                        <span>₹ {pricingBreakdown.tax.toFixed(2)}</span>
                                                    </div>
                                                    <div className="h-px bg-slate-700/50 my-2"></div>
                                                    <div className="flex justify-between items-center text-xl sm:text-lg text-slate-100 font-bold">
                                                        <span>Total Payable</span>
                                                        <span>₹ {pricingBreakdown.total}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded">
                                                No valid registration option available.
                                            </div>
                                        )}

                                        {registrationOption && !termsAccepted && (
                                            <p className="text-red-400 text-sm mb-2 font-medium">
                                                Please agree to the terms and conditions
                                            </p>
                                        )}

                                        {registrationOption && termsAccepted && !isMerchDetailsComplete && (
                                            <p className="text-red-400 text-sm mb-2 font-medium text-center bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                                                Please fill all the required merchandise details to proceed with payment
                                            </p>
                                        )}

                                        {isInAppBrowser() && (
                                            <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
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

                                        <button
                                            className={`button w-full py-4 text-lg sm:text-base text-white shadow-lg bg-[#5b21b6] font-moco font-bold ${(!registrationOption || !termsAccepted || !isMerchDetailsComplete || isPaymentInitiating) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                                            onClick={handlePayment}
                                            disabled={!registrationOption || !termsAccepted || !isMerchDetailsComplete || isPaymentInitiating}
                                        >
                                            {isPaymentInitiating ? 'Opening payment page...' : (pricingBreakdown ? `Pay ₹ ${pricingBreakdown.total}` : 'Complete Registration')}
                                        </button>
                                    </>

                                )}
                            </div>
                        </div>
                    </LiquidGlassCard>

                    <PaymentProcessingModal
                        isOpen={modalState.isOpen}
                        isAlumni={isAlumni}
                        onClose={() => {
                            setModalState(prev => ({ ...prev, isOpen: false }))
                            // Optionally refetch user or redirect
                            if (modalState.status === 'SUCCESS' || modalState.pid) {
                                navigate('/')
                            }
                        }}
                        userId={user?.id}
                        completedPid={modalState.pid}
                        failed={modalState.status === 'FAILED'}
                    />
                </section>
            </div>
        </>
    )
}

export default RegisterPage
