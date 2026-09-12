import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { fetchColleges } from '../api/colleges'
import { updateUserCollege } from '../api/auth'
import { showToast } from '../utils/toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, AlertTriangle } from 'lucide-react'

export default function WrongCollegeModal() {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)

    const [selectedCollegeId, setSelectedCollegeId] = useState<number | undefined>()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Verify condition: Email is a student.nitte.edu.in or student.edu.in email BUT collegeId is NMAMIT (1)
    useEffect(() => {
        const isNitteStudent = user?.email?.toLowerCase().endsWith('@student.nitte.edu.in') || user?.email?.toLowerCase().endsWith('@student.edu.in')
        if (isNitteStudent && user?.collegeId === 1 && !user?.alumniStatus && !user?.yearOfGraduation) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }, [user])

    const { data: colleges = [], isLoading: isCollegesLoading } = useQuery({
        queryKey: ['colleges'],
        queryFn: fetchColleges,
        enabled: isOpen,
    })

    const nitteCollegeIds = useMemo(() => {
        return colleges
            .filter(
                (college) =>
                    college.name === 'NMAM INSTITUTE OF TECHNOLOGY' ||
                    college.name === 'NITTE MEENAKSHI INSTITUTE OF TECHNOLOGY BANGALORE' ||
                    college.type === 'NON_ENGINEERING'
            )
            .map((c) => c.id)
    }, [colleges])

    const nmamitId = useMemo(() => {
        return colleges.find((c) => c.name === 'NMAM INSTITUTE OF TECHNOLOGY')?.id
    }, [colleges])

    const validNitteColleges = useMemo(() => {
        return colleges.filter(c => nitteCollegeIds.includes(c.id) && c.id !== nmamitId)
    }, [colleges, nitteCollegeIds, nmamitId])

    const handleSubmit = async () => {
        if (!selectedCollegeId) {
            showToast('Please select your correct college', 'error')
            return
        }

        setIsSubmitting(true)
        try {
            await updateUserCollege(selectedCollegeId)
            showToast('College updated successfully!', 'success')

            // Update local auth context by forcing refetch
            void queryClient.invalidateQueries({ queryKey: ['me'] })

            setIsOpen(false)
        } catch (error: any) {
            console.error(error)
            showToast(error?.response?.data?.message || 'Failed to update college', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                {/* Backdrop overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="relative w-full max-w-md rounded-2xl bg-black/80 border border-white/10 shadow-2xl"
                    style={{
                        boxShadow: '0 0 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.02)',
                    }}
                >
                    {/* Subtle gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-rose-500 via-purple-500 to-sky-500" />

                    <div className="p-6 md:p-8 flex flex-col items-center text-center">

                        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                            <AlertTriangle className="text-rose-400" size={24} />
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">Update College Error</h2>
                        <p className="text-white/70 text-sm mb-6 max-w-sm">
                            You registered as a Nitte student but seem to have the wrong college selection. Please select your correct college below to continue.
                        </p>

                        <div className="w-full space-y-2 relative text-left">
                            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest px-2">
                                Select Your College
                            </label>

                            <div
                                onClick={() => !isCollegesLoading && setDropdownOpen(v => !v)}
                                className={`
                  relative h-[48px] flex items-center cursor-pointer
                  bg-white/5 border border-white/10 rounded-xl
                  px-4 text-sm text-white
                  transition-all duration-300
                  ${dropdownOpen ? 'border-white/30 bg-white/10 ring-1 ring-white/10' : 'hover:bg-white/10'}
                  ${isCollegesLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                            >
                                <span className="truncate text-white/90">
                                    {validNitteColleges.find(c => c.id === selectedCollegeId)?.name ||
                                        (isCollegesLoading ? 'Loading colleges…' : 'Select a college')}
                                </span>

                                <span className="absolute right-4 text-white/40">
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-white/80' : ''
                                            }`}
                                    />
                                </span>
                            </div>

                            {dropdownOpen && !isCollegesLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute z-50 left-0 right-0 top-full mt-2"
                                >
                                    <div className="
                    max-h-56 overflow-y-auto
                    rounded-xl bg-[#0f0f0f]
                    border border-white/15
                    shadow-xl
                    py-2
                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-white/10
                    [&::-webkit-scrollbar-thumb]:rounded-full
                  ">
                                        {validNitteColleges.map(college => (
                                            <div
                                                key={college.id}
                                                onClick={() => {
                                                    setSelectedCollegeId(college.id)
                                                    setDropdownOpen(false)
                                                }}
                                                className={`
                          mx-2 my-1 px-4 py-2.5 rounded-lg
                          text-sm cursor-pointer
                          transition-all duration-200
                          flex items-center justify-between
                          ${selectedCollegeId === college.id
                                                        ? 'bg-white/10 text-white'
                                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                    }
                        `}
                                            >
                                                <span className="truncate pr-4">{college.name}</span>
                                                {selectedCollegeId === college.id && (
                                                    <span className="text-white/50 text-xs">✓</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !selectedCollegeId}
                            className={`
                mt-8 w-full h-[48px] rounded-xl font-bold text-sm tracking-widest uppercase
                transition-all duration-300
                ${selectedCollegeId
                                    ? 'bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'}
              `}
                        >
                            {isSubmitting ? 'Updating...' : 'Update College'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}