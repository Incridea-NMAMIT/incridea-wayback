import { useMutation } from "@apollo/client";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AddXpDocument, GetCoreTeamMembersDocument, type GetCoreTeamMembersQuery, GetUserXpDocument } from "~/generated/generated";
import Banner from "~/components/aboutUs/banner";
import { CONSTANT } from "~/constants";
import CoreTeam from "~/components/aboutUs/coreTeam";
import { AuthStatus, useAuth } from "~/hooks/useAuth";
import { type GetStaticProps } from "next";
import { client } from "~/lib/apollo";

type Props = | {
  coreTeamMembers: Extract<
    GetCoreTeamMembersQuery["getCoreTeamMembers"],
    {
      __typename: "QueryGetCoreTeamMembersSuccess";
    }
  >["data"];
  error?: never;
}
  | {
    coreTeamMembers?: never;
    error: string;
  };

const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const { data: coreTeamMembers } = await client.query({
      query: GetCoreTeamMembersDocument,
      fetchPolicy: "no-cache"
    })

    if (coreTeamMembers.getCoreTeamMembers.__typename === "Error")
      throw new Error(coreTeamMembers.getCoreTeamMembers.message);

    return {
      props: {
        coreTeamMembers: coreTeamMembers.getCoreTeamMembers.data,
      },
      revalidate: 60
    }
  } catch (error) {
    console.log(error)
    return {
      props: {
        error: error instanceof Error ? error.message : "Could not fetch techTeamMembers",
      },
      revalidate: 60,
    };
  }
}

const images = [
  { id: CONSTANT.ASSETS.ABOUT.IMAGE1, alt: "Image 1" },
  { id: CONSTANT.ASSETS.ABOUT.IMAGE2, alt: "Image 2" },
  { id: CONSTANT.ASSETS.ABOUT.IMAGE3, alt: "Image 3" },
  { id: CONSTANT.ASSETS.ABOUT.IMAGE4, alt: "Image 4" },
  { id: CONSTANT.ASSETS.ABOUT.IMAGE5, alt: "Image 5" },
  { id: CONSTANT.ASSETS.ABOUT.IMAGE6, alt: "Image 6" },
  { id: CONSTANT.ASSETS.ABOUT.IMAGE7, alt: "Image 7" },
  { id: CONSTANT.ASSETS.ABOUT.IMAGE8, alt: "Image 8" },
];

const About = ({ coreTeamMembers }: Props) => {
  const session = useAuth();

  const [isActive, setIsActive] = useState(false);
  const [calledXp, setCalledXp] = useState(false);

  const [addXp] = useMutation(AddXpDocument, {
    variables: {
      levelId: "2",
    },
    refetchQueries: [GetUserXpDocument],
    awaitRefetchQueries: true,
  });

  const handleAddXp = async () => {
    if (session.status !== AuthStatus.AUTHENTICATED) {
      toast.error("Please login to collect the Time Stones!", {
        position: "bottom-center",
        style: {
          backgroundColor: "#f1e5d0",
          color: "#005c39",
          fontWeight: "bold",
        },
      });
      return
    }

    if (calledXp)
      return;

    setCalledXp(true);
    const { data } = await addXp()
    if (data?.addXP.__typename === "MutationAddXPSuccess")
      toast.success(
        `Congratulations! You have found ${data.addXP.data.level.point} Time Stones!`,
        {
          position: "bottom-center",
          style: {
            backgroundColor: "#f1e5d0",
            color: "#005c39",
            fontWeight: "bold",
          },
        },
      );
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-4 md:p-32 pb-10 flex flex-col gap-y-2 md:gap-16 items-center md:items-stretch">
      <div className="flex min-h-screen flex-col gap-y-2 md:gap-16">
        <Banner video={"https://vimeo.com/1055845788?share=copy"} credits="" />

        <span className="text-base text-white md:text-lg xl:text-xl">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <Image
              src={CONSTANT.ASSETS.PUBLIC.NITTE_LOGO}
              alt="image"
              loading="lazy"
              className="top-0 h-full w-3/4 object-contain object-center md:w-1/3"
              height={500}
              width={500}
            />
            <div className="max-w-3xl text-justify">
              Nitte Mahalinga Adyantaya Memorial Institute of Technology
              (NMAMIT), Nitte, established in 1986 and recognized by the
              All-India Council for Technical Education, New Delhi, has been a
              constituent college of Nitte (Deemed to be University), Mangaluru,
              since June 2022. NMAMIT is placed in the Rank band 151-200 in the
              National Institutional Ranking Framework (NIRF) 2024 by the
              Ministry of Education, Government of India. NMAMIT, the off-campus
              centre of Nitte DU located at Nitte Village, has active
              collaborations with several international universities and
              organizations for faculty and student exchanges, research,
              internships and placements.
              <br />
              <br />
              The Institute offers UG engineering program in fifteen
              disciplines, PG program M.Tech. in seven disciplines & MCA
              program. All the departments have qualified research guides for
              students interested in taking up research work leading to Ph.D.
              For details, visit{" "}
              <a
                href="https://www.nitte.edu.in/nmamit"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                www.nitte.edu.in/nmamit
              </a>
            </div>
          </div>
        </span>
      </div>

      <Banner video={"https://vimeo.com/1055896700?share=copy"} credits="" />

      <span className="text-base text-white md:text-lg xl:text-xl">
        <div className="relative flex flex-col items-center justify-between gap-16 lg:flex-row">
          {/* Gallery Section - Contained width, proper spacing */}
          <div className="relative w-full lg:w-1/3 md:pt-24 pt-40 pb-28 my-4">
            <style jsx>{`
              .gallery {
                --s: min(120px, 80vw);
                position: relative;
                width: var(--s);
                height: var(--s);
                margin: 0 auto;
                cursor: pointer;
                z-index: 10;
              }

              .gallery > img {
                position: absolute;
                width: 100%;
                height: 100%;
                grid-area: 1/1;
                border-radius: 50%;
                object-fit: cover;
                transform: scale(0.5);
                opacity: 0;
                transition:
                  transform 1s ease,
                  opacity 0.5s ease;
              }

              ${images
                .map(
                  (_, index) => `
                .gallery > img:nth-of-type(${index + 2}) {
                  --i: ${index + 1};
                  transition-delay: ${index * 0.1}s;
                }
              `,
                )
                .join("\n")}

              .gallery > img.active {
                opacity: 1;
                transform: rotate(calc(var(--i) * 360deg / 8))
                  translate(calc(1.5 * var(--s)))
                  rotate(calc(var(--i) * -360deg / 8));
              }

              @media (max-width: 1024px) {
                .gallery {
                  --s: min(100px, 60vw);
                }

                .gallery > img.active {
                  transform: rotate(calc(var(--i) * 360deg / 8))
                    translate(calc(1.2 * var(--s)))
                    rotate(calc(var(--i) * -360deg / 8));
                }
              }

              @media (max-width: 480px) {
                .gallery {
                  --s: min(95px, 60vw);
                }

                .gallery > img.active {
                  transform: rotate(calc(var(--i) * 360deg / 8))
                    translate(calc(1 * var(--s)))
                    rotate(calc(var(--i) * -360deg / 8));
                }
              }

              .logo {
                z-index: 10;
                transform-origin: center;
                opacity: 1 !important;
              }
            `}</style>

            <div className="gallery" onClick={() => setIsActive(!isActive)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CONSTANT.ASSETS.PUBLIC.LOGO_RIM_WHITE}
                alt="Incridea Logo"
                loading="lazy"
                className={`object-contain logo ${isActive ? "active" : ""} object-contain origin-bottom animate-shakelogo`}
                height={400}
                width={400}
                onClick={async () => await handleAddXp()}
              />
              {images.map(({ id, alt }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={id}
                  src={id}
                  alt={alt}
                  className={`${isActive ? "active " : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Content Section - More width, proper spacing */}
          <div className="relative z-0 w-full lg:w-2/3 px-2 flex justify-center items-center">
            <div className="max-w-3xl text-justify">
              Incridea is a colossal national-level techno-cultural fest with an
              audience pool spread among{" "}
              <span className="font-bold">200 colleges</span> all across India.
              The fest holds the values abbreviated in the name, i.e.{" "}
              <span className="font-bold">Innovate, Create and Ideate</span> at
              the highest standard possible by becoming a symbol of technology,
              passion, culture and conviction among students. Incridea is
              conducted with the help of many services and technology created
              and operated by students, making it one of the most indigenous
              college fests with resources and capabilities beyond expectations.
              <br />
              <br />
              Pronites of Incridea has seen a wide range of popular and talented
              artists, DJs, and bands. The fest constitutes over{" "}
              <span className="font-bold">40+ events</span> and expected
              footfall of around <span className="font-bold">45,000</span>,
              making it one of the most happening fests in the region. With
              grand successes over the years and a flair for perfection, we
              intend to make Incridea &apos;{CONSTANT.YEAR_SHORT} and grand
              success and the best one so far.
            </div>
          </div>
        </div>
      </span>

      {coreTeamMembers &&
        <CoreTeam coreTeamMembers={coreTeamMembers} />
      }

    </div>
  );
};

export default About;

export { getStaticProps };
