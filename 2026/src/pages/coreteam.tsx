import { motion } from 'framer-motion'
import Slideshow from '../components/slideshow/slideshow'
import CoreTeamCard from '../components/core-teamcard'
import MovieCredits from '../components/MovieCredits'
import SEO from '../components/SEO'
import { archiveSnapshot } from '../archive/archive'

type CoreTeamMember = {
  imageSrc: string | null
  title: string
  subtitle: string
}

const teamMembers = (archiveSnapshot?.data.coreTeam ?? []) as CoreTeamMember[]
const creditsData = archiveSnapshot?.data.committeeMembers ?? []

export default function CoreTeamPage() {
  const teamImages = [
    '/bg8.webp',
    '/bg8.webp',
    '/bg8.webp',
  ];

  return (
    <>
      <SEO
        title="Core Team"
        description="Meet the core team behind Incridea'26."
        url="/core-team"
      />
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');`}
      </style>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg8.webp')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <section className="flex flex-col items-center max-w-full py-12 px-4 overflow-x-hidden">
        <Slideshow
          images={teamImages}
          autoplayDelay={4000}
        />

        {/* Animated Title - Fade Up */}
        <div className="relative pt-20 mt-4 flex flex-col items-center justify-center w-full">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl whitespace-nowrap sm:top-23 md:top-20 lg:top-13 top-22 text-center absolute font-bold w-full mt-12 bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent tracking-wider"
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
          <div className="flex flex-wrap relative z-20 gap-16 mt-16 w-full max-w-6xl justify-center">
            {teamMembers.map((member, index) => (
              <CoreTeamCard
                key={index}
                imageSrc={member.imageSrc || '/chill.jpg'}
                title={member.title}
                subtitle={member.subtitle}
              />
            ))}
          </div>
        </div>
        {/* movie credits section */}
        <div className="w-full mt-5">
          <MovieCredits sections={creditsData} />
        </div>
      </section>
    </>
  )
}
