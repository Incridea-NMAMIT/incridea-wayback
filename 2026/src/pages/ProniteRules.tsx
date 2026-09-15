import LiquidGlassCard from '../components/liquidglass/LiquidGlassCard';
import SEO from '../components/SEO';

function ProniteRules() {
    return (
        <>
            <div className="min-h-screen w-full px-4 py-8 text-slate-100 font-sans antialiased md:px-6 md:mx-64">
                <SEO
                    title="Pronite Rules"
                    description="Read the rules and regulations for Pronite at Incridea'26."
                    url="/pronite-rules"
                />
                <LiquidGlassCard className="mx-auto w-full max-w-6xl flex flex-col relative p-6 md:p-10">
                    <div className="md:p-10">
                        <div className="space-y-6 sm:space-y-8">
                            <header className="space-y-2 sm:space-y-4">
                                <h1 className="text-2xl sm:text-2xl lg:text-3xl tracking-wider font-life-craft text-white drop-shadow-[0_0_15px_rgba(216,180,254,0.3)] font-bold">
                                    PRONITE RULES
                                </h1>
                            </header>
                            <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-purple-200/20 to-transparent" />

                            <div className="text-slate-200 space-y-6 sm:space-y-8">
                                <section>
                                    <ul className="list-disc pl-4 sm:pl-6 space-y-4 sm:space-y-6 text-slate-300 leading-relaxed text-sm sm:text-sm lg:text-base marker:text-sky-300">
                                        <li>Access to Pronites is strictly limited to students from engineering institutions and students from Nitte Sister Institutes.</li>
                                        <li>In the event of entry by individuals from non-engineering colleges or any fraudulent attempts to gain access, the organising committee reserves the right to deny entry, and no refund will be issued under such circumstances.</li>
                                        <li>Admission to the pronite is only permitted after scanning the attendee's PIDs at the pronite scanning booth.</li>
                                        <li>Upon successful scanning, the attendee will receive a wristband that must be presented to gain entry to BC Alva Hockey ground during the pronite.</li>
                                        <li>No food or water bottles are allowed inside the auditorium under any circumstances.</li>
                                        <li>Upon entrance, all bags and belongings will be thoroughly inspected; any perfumes, makeup kits/materials, intoxicating substances, any flammable materials, any sharp objects, weapons, weapon like objects or food items of any kind will not be allowed inside the venue and will be confiscated if found any.</li>
                                        <li>The use or possession of cameras of any kind is strictly prohibited inside the venue. Only smartphones are permitted.</li>
                                        <li>Entry to the venue while intoxicated is strictly prohibited, as mentioned in the guidelines, they may be expelled from the campus and their registration will be cancelled.</li>
                                        <li>Attendees who cause a disturbance or inconvenience to others will be immediately removed from the venue and barred from re-entry.</li>
                                        <li>Security officials, disciplinary committee, and Team Incridea will be present at all times during the pronite to monitor and prevent any unruly behaviour. In case of an emergency, please seek their assistance.</li>
                                        <li>Attendees are required to comply with the instructions of the Team Incridea, security officials, disciplinary committee and at all times. The decisions made by them are final and non-negotiable.</li>
                                    </ul>
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

export default ProniteRules;
