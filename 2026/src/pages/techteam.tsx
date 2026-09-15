import { motion } from "framer-motion";
import TechCard from "../components/TechCard";
import { useQuery } from "@tanstack/react-query";
import { getTechnicalTeam } from "../api/technicalTeam";
import { Loader2 } from "lucide-react";
import SEO from "../components/SEO";

export default function TechTeamPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["technicalTeam"],
    queryFn: getTechnicalTeam,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return (
    <>
      <SEO
        title="Technical Team"
        description="Meet the technical team behind Incridea'26."
        url="/tech-team"
      />
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');`}
      </style>
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 " />
      </div>

      {}
      <section className="flex flex-col items-center w-full pt-0 sm:pt-2 md:pt-4 lg:pt-6 pb-12 px-4">
        {}
        <div className="relative pt-20 -mt-24 lg:mt-0 flex flex-col items-center justify-center w-full">
          {}
          <motion.h1
            className="text-2xl min-[375px]:text-3xl sm:text-5xl md:text-6xl lg:text-8xl whitespace-nowrap sm:top-13 md:top-11 lg:top-4 top-17 text-center absolute font-bold w-full mt-12 bg-linear-to-b from-white via-white to-transparent bg-clip-text text-transparent tracking-wider drop-shadow-md"
            style={{ fontFamily: '"Michroma", sans-serif' }}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: 0.5,
            }}
          >
            TECH TEAM
            {}
          </motion.h1>
          {}
          <div className="flex flex-wrap  relative z-20 gap-16 mt-16 w-full max-w-7xl justify-center min-h-[50vh]">
            {}
            {isLoading ? (
              <div className="flex justify-center items-center w-full h-full">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">
                Failed to load team members
              </div>
            ) : (
              data?.members.map((member) => (
                  <TechCard
                    key={member.archiveId ?? member.userId ?? member.name}
                    image={member.image ?? "/chill.jpg"}
                    name={member.name}
                    designation={member.role}
                    skills={member.skills}

                    quote={member.quote ?? undefined}
                    socials={{
                      github: member.socials.github ?? undefined,
                      linkedin: member.socials.linkedin ?? undefined,
                    }}
                  />
                ))
            )}
            {!isLoading && !error && (!data || data.members.length === 0) && (
              <div className="text-white text-center w-full mt-10 font-moco text-xl">
                Technical team member data doesn't exist.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
