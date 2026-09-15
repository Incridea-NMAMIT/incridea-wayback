// import { useState } from 'react';
import LiquidGlassCard from '../components/liquidglass/LiquidGlassCard';
import SEO from '../components/SEO';
// import { compressImage } from '../utils/compression';
// import { useUploadThing } from '../utils/uploadthing';
// import { toast } from 'react-toastify';
// import { useRef } from 'react';

/*
const institutions = [
    'NMAM INSTITUTE OF TECHNOLOGY',
    'NITTE UNIVERSITY CENTRE FOR SCIENCE EDUCATION AND RESEARCH',
    'NITTE INSTITUTE OF HOSPITALITY SERVICES',
    'NRAM AIDED POLYTECHNIC, NITTE',
    'Dr. NSAM FIRST GRADE COLLEGE, NITTE, KARKALA',
    'JUSTICE K S HEGDE INSTITUTE OF MANAGEMENT, NITTE',
    'NITTE INSTITUTE OF PHYSIOTHERAPY, MANGALORE',
    'Dr. NSAM FIRST GRADE COLLEGE, BANGALORE',
    'NITTE INSTITUTE OF PROFESSIONAL EDUCATION',
    'NITTE INSTITUTE OF PROFESSIONAL EDUCATION COLLEGE, MANGALURU',
    'NITTE GULABI SHETTY MEMORIAL INSTITUTE OF PHARMACEUTICAL SCIENCES',
    'NITTE USHA INSTITUTE OF NURSING SCIENCES',
    'K.S. HEGDE MEDICAL ACADEMY',
    'AB SHETTY MEMORIAL INSTITUTE OF DENTAL SCIENCES',
    'NITTE INSTITUTE OF ARCHITECTURE',
    'NITTE INSTITUTE OF COMMUNICATION',
];

interface ExistingFaculty {
    name: string;
    email: string;
    designation: string;
    institution: string;
    facultyId: string;
    dependantsCount: number;
    status: string;
}
*/

export default function FacultyRegistrations() {
    /*
    const [existingFaculty, setExistingFaculty] = useState<ExistingFaculty | null>(null);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [isUpdatingDependants, setIsUpdatingDependants] = useState(false);
    const [newDependantsCount, setNewDependantsCount] = useState<number>(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        designation: '',
        institution: '',
        facultyId: '',
        dependantsCount: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { startUpload } = useUploadThing("facultyIdProof");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const toastId = toast.loading("Compressing and uploading image...");
        try {
            // For PDFs, we don't compress using the image compressor. If it's an image, compress to webp.
            let fileToUpload = file;
            if (file.type.startsWith("image/")) {
                fileToUpload = await compressImage(file, 1); // 1MB limit
            }

            const uploadRes = await startUpload([fileToUpload]);

            if (uploadRes && uploadRes[0]) {
                const url = uploadRes[0].ufsUrl || uploadRes[0].url;
                setFormData({ ...formData, facultyId: url });
                toast.update(toastId, { render: "ID uploaded successfully", type: "success", isLoading: false, autoClose: 3000 });
            } else {
                throw new Error("No URL returned from upload");
            }
        } catch (error) {
            console.error("Upload failed", error);
            const err = error as Error;
            toast.update(toastId, { render: `Upload failed: ${err.message}`, type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input
            }
        }
    };

    const handleEmailBlur = async () => {
        if (!formData.email) return;

        setCheckingEmail(true);
        try {
            const rawBaseUrl = typeof import.meta.env.VITE_API_URL === 'string' && import.meta.env.VITE_API_URL.length > 0 ? import.meta.env.VITE_API_URL : '';
            const apiBaseUrl = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

            const response = await fetch(`${apiBaseUrl}/faculty-registration/email/${encodeURIComponent(formData.email)}`);
            if (response.ok) {
                const data = await response.json();
                setExistingFaculty(data);
                setNewDependantsCount(data.dependantsCount);
            } else {
                setExistingFaculty(null);
            }
        } catch (error) {
            console.error('Error checking email:', error);
        } finally {
            setCheckingEmail(false);
        }
    };

    const handleUpdateDependants = async () => {
        if (!existingFaculty) return;
        setIsUpdatingDependants(true);
        try {
            const rawBaseUrl = typeof import.meta.env.VITE_API_URL === 'string' && import.meta.env.VITE_API_URL.length > 0 ? import.meta.env.VITE_API_URL : '';
            const apiBaseUrl = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

            const response = await fetch(`${apiBaseUrl}/faculty-registration/email/${encodeURIComponent(existingFaculty.email)}/dependants`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dependantsCount: newDependantsCount }),
            });

            if (!response.ok) throw new Error('Failed to update');

            setExistingFaculty({ ...existingFaculty, dependantsCount: newDependantsCount });
            toast.success('Dependants count updated successfully!');
        } catch (error) {
            toast.error('Failed to update dependants count.');
        } finally {
            setIsUpdatingDependants(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.designation || !formData.institution || !formData.facultyId) {
            toast.error('Please fill all fields and upload your ID proof.');
            return;
        }

        setIsSubmitting(true);
        try {
            const rawBaseUrl =
                typeof import.meta.env.VITE_API_URL === 'string' &&
                    import.meta.env.VITE_API_URL.length > 0
                    ? import.meta.env.VITE_API_URL
                    : '';

            const apiBaseUrl = rawBaseUrl.endsWith('/api')
                ? rawBaseUrl
                : `${rawBaseUrl}/api`;

            const response = await fetch(`${apiBaseUrl}/faculty-registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit registration');
            }

            setIsSuccess(true);
            toast.success('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen text-white relative overflow-x-hidden flex items-center justify-center pt-24 pb-16">
                <div className="fixed inset-0 bg-black/40 -z-10" />
                <div className="fixed inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 rounded-full bg-linear-to-br from-green-500 to-emerald-500 opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-56 h-56 md:w-80 md:h-80 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 opacity-15 blur-3xl"></div>
                </div>

                <div className="px-4 w-full max-w-xl mx-auto z-10">
                    <LiquidGlassCard>
                        <div className="p-8 text-center space-y-6">
                            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-lg text-emerald-400">
                                Registration Successful!
                            </h1>
                            <p className="text-slate-300 text-lg">
                                Thank you for registering. Your details have been submitted successfully.
                            </p>
                            <button
                                onClick={() => {
                                    setFormData({ name: '', email: '', designation: '', institution: '', facultyId: '', dependantsCount: 0 });
                                    setIsSuccess(false);
                                }}
                                className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors shadow-lg"
                            >
                                Register Another
                            </button>
                        </div>
                    </LiquidGlassCard>
                </div>
            </div>
        );
    }
    */

    return (
        <>
            <SEO
                title="Faculty Registration - Incridea"
                description="Register as a faculty for Incridea events."
                url="/faculty-registrations"
            />

            <div className="min-h-screen text-white relative overflow-x-hidden pt-24 pb-16">
                <div className="fixed inset-0 bg-black/40 -z-10" />

                <div className="fixed inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 rounded-full bg-linear-to-br from-black-500 to-pink-500 opacity-20 blur-3xl"></div>
                    <div className="absolute top-40 right-20 w-72 h-72 md:w-112.5 md:h-112.5 rounded-full bg-linear-to-br from-blue-500 to-cyan-400 opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-20 left-1/2 w-56 h-56 md:w-80 md:h-80 rounded-full bg-linear-to-br from-black-600 to-blue-600 opacity-15 blur-3xl"></div>
                </div>

                <div className="px-4 mx-auto max-w-3xl z-10 relative">
                    <header className="space-y-3 text-center mb-10">
                        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                            Faculty Registration
                        </h1>
                        <p className="mx-auto max-w-xl text-base md:text-lg text-slate-100 drop-shadow-md">
                            Faculty registrations have been closed.
                        </p>
                    </header>

                    <LiquidGlassCard>
                        <div className="p-12 text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">Registrations Closed</h2>
                            <p className="text-slate-300 font-medium text-lg">Faculty registrations have been closed.</p>
                        </div>
                    </LiquidGlassCard>

                    {/* <LiquidGlassCard>
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-slate-300 text-sm font-semibold uppercase tracking-wider block">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full bg-black/20 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-black-500/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-slate-300 text-sm font-semibold uppercase tracking-wider block">
                                    Email ID
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        if (existingFaculty) setExistingFaculty(null);
                                    }}
                                    onBlur={handleEmailBlur}
                                    placeholder="Enter your email address"
                                    className={`w-full bg-black/20 border ${checkingEmail ? 'border-indigo-500/50' : 'border-slate-700/50'} rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-black-500/50 transition-all`}
                                />
                                {checkingEmail && <p className="text-indigo-400 text-[10px] mt-1 italic pl-1">Checking email...</p>}
                                <p className="text-white text-[10px] mt-1 italic pl-1">
                                    * Please use your college email ID
                                </p>
                            </div>

                            {existingFaculty ? (
                                <div className="space-y-6 pt-4 border-t border-slate-700/50 mt-6">
                                    <h3 className="text-xl font-bold text-white">Registration Found</h3>
                                    <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-slate-700/50">
                                        <p className="text-sm text-slate-300"><span className="font-semibold text-slate-400">Name:</span> {existingFaculty.name}</p>
                                        <p className="text-sm text-slate-300"><span className="font-semibold text-slate-400">Designation:</span> {existingFaculty.designation}</p>
                                        <p className="text-sm text-slate-300"><span className="font-semibold text-slate-400">Institution:</span> {existingFaculty.institution}</p>
                                        <p className="text-sm text-slate-300"><span className="font-semibold text-slate-400">Status:</span>
                                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${existingFaculty.status === 'GRANTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : existingFaculty.status === 'DECLINED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                {existingFaculty.status}
                                            </span>
                                        </p>
                                    </div>

                                    {existingFaculty.dependantsCount === 0 ? (
                                        <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-slate-700/50">
                                            <p className="text-sm text-slate-300 font-medium">You can update your dependants count:</p>
                                            <div className="flex gap-3 items-end">
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
                                                        Dependants Count
                                                    </label>
                                                    <select
                                                        value={newDependantsCount}
                                                        onChange={(e) => setNewDependantsCount(parseInt(e.target.value))}
                                                        className="w-full bg-black/50 border border-indigo-500/30 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer appearance-none"
                                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                                                    >
                                                        <option value={0} className="bg-slate-900">0</option>
                                                        <option value={1} className="bg-slate-900">1</option>
                                                        <option value={2} className="bg-slate-900">2</option>
                                                    </select>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleUpdateDependants}
                                                    disabled={isUpdatingDependants || newDependantsCount === existingFaculty.dependantsCount}
                                                    className="px-4 py-2 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isUpdatingDependants ? 'Updating...' : 'Update'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 bg-black/20 p-4 rounded-xl border border-slate-700/50">
                                            <p className="text-sm text-slate-300"><span className="font-semibold text-slate-400">Dependants Count:</span> {existingFaculty.dependantsCount}</p>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setExistingFaculty(null);
                                            setFormData({ ...formData, email: '' });
                                        }}
                                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
                                    >
                                        Register a different email
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-slate-300 text-sm font-semibold uppercase tracking-wider block">
                                            Designation
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.designation}
                                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                            placeholder="E.g. Professor, Assistant Professor"
                                            className="w-full bg-black/20 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-black/50 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-slate-300 text-sm font-semibold uppercase tracking-wider block">
                                            Institution
                                        </label>
                                        <select
                                            required
                                            value={formData.institution}
                                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                            className="w-full bg-black/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:ring-2 focus:ring-black-500/50 transition-all cursor-pointer appearance-none"
                                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                                        >
                                            <option value="" disabled className="bg-slate-900">Select an institution</option>
                                            {institutions.map((inst, index) => (
                                                <option key={index} value={inst} className="bg-slate-900 p-2">
                                                    {inst}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-slate-300 text-sm font-semibold uppercase tracking-wider block">
                                            Dependants Count
                                        </label>
                                        <select
                                            required
                                            value={formData.dependantsCount}
                                            onChange={(e) => setFormData({ ...formData, dependantsCount: parseInt(e.target.value) })}
                                            className="w-full bg-black/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:ring-2 focus:ring-black-500/50 transition-all cursor-pointer appearance-none"
                                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                                        >
                                            <option value={0} className="bg-slate-900">0</option>
                                            <option value={1} className="bg-slate-900">1</option>
                                            <option value={2} className="bg-slate-900">2</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <label className="text-slate-300 text-sm font-semibold uppercase tracking-wider block">
                                            Upload Faculty ID (Image or PDF)
                                        </label>
                                        {!formData.facultyId ? (
                                            <div className="border border-slate-700/50 bg-black/20 rounded-xl p-6 flex flex-col items-center justify-center min-h-[160px]">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    accept="image/*,application/pdf"
                                                    className="hidden"
                                                    id="faculty-id-upload"
                                                />
                                                <button
                                                    type="button"
                                                    disabled={isUploading}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-6 py-2 bg-black-600 hover:bg-black-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {isUploading ? "Uploading..." : "Choose File"}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="border border-green-500/30 bg-green-500/10 rounded-xl p-4 flex items-center justify-between">
                                                <span className="text-green-400 font-medium">✓ Upload Successful</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, facultyId: '' })}
                                                    className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 bg-black/10 border border-black/20 rounded-xl p-4">
                                        <p className="text-red-400 text-xs font-semibold uppercase tracking-wider">Important Notices:</p>
                                        <ul className="list-disc list-inside text-slate-300 text-xs space-y-2">
                                            <li>If faculties exceeds the number of registered faculty members, seating may be insufficient.</li>
                                            <li>This pass is strictly non-transferable and can be used only by the respective faculty member.</li>
                                            <li>The faculty passes will be available and sent through mail a day before the pronite.</li>
                                        </ul>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || isUploading || !formData.facultyId}
                                            className="w-full py-4 bg-linear-to-r from-black-600 to-pink-600 hover:from-black-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-black-900/40 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                        >
                                            {isSubmitting ? 'Registering...' : 'Register as Faculty'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </LiquidGlassCard> */}
                </div>
            </div>
        </>
    );
}
