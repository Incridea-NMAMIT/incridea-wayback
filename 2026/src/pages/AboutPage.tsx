import LiquidGlassCard from '../components/liquidglass/LiquidGlassCard';
import SEO from '../components/SEO';

import { motion } from 'framer-motion';
import CoreTeamCard from '../components/core-teamcard';
import MovieCredits from '../components/MovieCredits';
import { useEffect, useState } from 'react';
import { fetchCoreTeam, fetchCommitteeMembers } from '../api/public';
import type { CoreTeamMember, CreditsSection } from '../api/public';

const AboutPage = () => {
    const [teamMembers, setTeamMembers] = useState<CoreTeamMember[]>([]);
    const [creditsData, setCreditsData] = useState<CreditsSection[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [team, credits] = await Promise.all([
                    fetchCoreTeam(),
                    fetchCommitteeMembers(),
                ]);
                setTeamMembers(team);
                setCreditsData(credits);
            } catch (error) {
                console.error("Failed to load about page data", error);
            }
        };
        loadData();
    }, []);


    return (
        <>
            <SEO
                title="About Us - Incridea"
                description="Learn about Incridea, the premier national-level techno-cultural fest of NMAMIT Nitte. Discover our core team, rich legacy, and vision for innovation and creativity."
                url="/about"
            />


            <div className="w-full px-4 py-12 text-slate-100 font-sans antialiased md:px-6 flex flex-col items-center">
                <LiquidGlassCard
                    className="w-full min-h-screen flex flex-col relative p-0 overflow-hidden"
                >
                    <div className="w-full max-w-6xl mx-auto p-6 md:p-10 mb-20 space-y-12">
                        {/* Page Title */}
                        <div className="text-center mb-12">
                            <h1 className="text-xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 drop-shadow-lg tracking-wider" style={{ fontFamily: '"Michroma", sans-serif' }}>
                                ABOUT INCRIDEA
                            </h1>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-20 items-center">
                            {/* NMAMIT Logo - Top Left */}
                            <div className="flex justify-center items-center order-1">
                                <img
                                    src="/nmamit.png"
                                    alt="NMAMIT Logo"
                                    className="w-64 md:w-112 h-auto object-contain drop-shadow-2xl"
                                    draggable={false}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </div>

                            {/* NMAMIT Text - Top Right */}
                            <div className="space-y-6 text-slate-200 text-sm md:text-xl leading-relaxed text-justify order-2 drop-shadow-lg">
                                <h2 className="text-4xl md:text-5xl font-bold invisible font-life-craft text-white mb-6 text-center md:text-left">NMAMIT</h2>
                                <p>
                                    Nitte Mahalinga Adyanthaya Memorial Institute of Technology (NMAMIT), Nitte, established in 1986 and recognised by the AICTE, New Delhi, is part of the Nitte (Deemed to be University), Mangaluru, since June 2022. Ranked in the 151-200 band in NIRF 2025 by the Ministry of Education, Government of India, NMAMIT collaborates with various international universities and organisations for faculty and student exchanges, research, internships, and placements.
                                </p>
                                <p>
                                    The institute offers undergraduate engineering programs across fourteen disciplines, as well as postgraduate MTech. programs in seven disciplines, and an MCA program. All departments have qualified research guides for students pursuing research leading to a Ph.D.
                                </p>
                                <p>
                                    For details, visit <a href="https://nitte.edu.in/nmamit" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-sky-400 underline">nitte.edu.in/nmamit</a>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-20 items-center">
                            {/* Incridea Text - Bottom Left (Desktop) / Order 4 (Mobile) */}
                            <div className="space-y-6 text-slate-200 text-sm md:text-xl leading-relaxed text-justify order-4 md:order-3 drop-shadow-lg">
                                <h2 className="text-4xl md:text-5xl font-bold font-life-craft invisible text-white mb-6 text-center md:text-right">INCRIDEA</h2>
                                <p>
                                    Incridea is a prestigious national-level techno-cultural fest that brings together students from institutions across India. Rooted in the core values of Innovation, Ideation, and Creation, the fest serves as a dynamic platform for showcasing technological excellence, cultural expression, and student-driven initiatives. Entirely conceptualized and executed by students, Incridea reflects a spirit of leadership, collaboration, and organizational excellence.
                                </p>
                                <p>
                                    With 40+ diverse events spanning technology, arts, and culture, Incridea draws an enthusiastic audience of nearly 7,000 participants and visitors each year. Over the years, Incridea has hosted an impressive lineup of renowned artists, DJs, and bands, making it one of the most anticipated collegiate festivals in the region.
                                </p>
                                <p>
                                    Anchored in a strong legacy of success, Incridea ’26 is set to surpass all previous editions. With grander experiences, bolder ideas, and unforgettable moments, Incridea ’26 aims to be the biggest, best, and most iconic chapter in Incridea’s journey.
                                </p>
                            </div>

                            {/* Incridea Logo - Bottom Right (Desktop) / Order 3 (Mobile) */}
                            <div className="flex justify-center items-center order-3 md:order-4">
                                <img
                                    src="/incridea-og.png"
                                    alt="Incridea Logo"
                                    className="w-64 md:w-96 h-auto object-contain p-2 drop-shadow-2xl"
                                    draggable={false}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </div>
                        </div>
                    </div>



                    <style>
                        {`@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap'); `}
                    </style>

                    {/* Core Team Section */}
                    <section className="flex flex-col items-center w-full max-w-full overflow-x-hidden text-slate-100 relative z-10 pb-20">
                        {/* Animated Title - Fade Up */}
                        <div className="relative pt-20 mt-4 flex flex-col items-center justify-center w-full">
                            <motion.h1
                                className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl sm:top-16 md:top-20 lg:top-13 top-2 text-center absolute font-bold w-full mt-12 bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent tracking-wider px-2"
                                style={{ fontFamily: '"Michroma", sans-serif' }}
                                initial={{ opacity: 0, y: 80 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 1,
                                    ease: "easeOut",
                                    delay: 0.5
                                }}
                            >
                                OUR CORE
                            </motion.h1>

                            {/* Team Members Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-20 gap-8 mt-16 sm:mt-32 w-full max-w-7xl justify-items-center items-center px-4">
                                {teamMembers.map((member, index) => (
                                    <CoreTeamCard
                                        key={index}
                                        imageSrc={member.imageSrc || '/chill.jpg'}
                                        title={member.title}
                                        subtitle={member.subtitle}
                                        eager={index < 4}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* movie credits section */}
                        <div className="w-full mt-24">
                            <MovieCredits sections={creditsData} />
                        </div>
                    </section>
                </LiquidGlassCard >
            </div >

        </>
    );
}

export default AboutPage;