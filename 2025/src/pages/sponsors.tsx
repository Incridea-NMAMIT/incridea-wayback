import React, { useState } from "react";
import SponsorGearCarousel from "~/components/sponsorsCard";
import { ArrowDown, MousePointerClick, Volume2, VolumeX } from "lucide-react";
import { type GetStaticProps } from "next";
import { client } from "~/lib/apollo";
import { GetSponsorsDocument, type GetSponsorsQuery } from "~/generated/generated";
import Link from "next/link";

type Props = | {
  sponsors: Extract<
    GetSponsorsQuery["getSponsors"],
    {
      __typename: "QueryGetSponsorsSuccess";
    }
  >["data"];
  error?: never;
}
  | {
    sponsors?: never;
    error: string;
  };

const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const { data: sponsors } = await client.query({
      query: GetSponsorsDocument,
      fetchPolicy: "no-cache"
    })

    if (sponsors.getSponsors.__typename === "Error")
      throw new Error(sponsors.getSponsors.message);

    return {
      props: {
        sponsors: sponsors.getSponsors.data,
      },
      revalidate: 60
    }
  } catch (error) {
    console.log(error)
    return {
      props: {
        error: error instanceof Error ? error.message : "Could not fetch sponsors",
      },
      revalidate: 60,
    };
  }
}

const Page = ({ sponsors }: Props) => {
  const [showAudioHelper, setShowAudioHelper] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    setShowAudioHelper(false);
  };

  return (
    <main className="h-full flex flex-col">
      {/* Navbar Spacing */}
      <div className="h-16" />

      {/* Audio Controls */}
      {showAudioHelper && (
        <div className="audio-helper absolute mx-2 top-[16%] sm:top-[10%] left-[7%] sm:left-[2%] md:left-auto md:top-[8%] md:right-[2%] z-50 flex flex-col items-center">
          <div className="bg-amber-500/10 backdrop-blur-sm rounded-lg p-2 mb-2">
            <p className="text-amber-500 text-sm whitespace-nowrap">
              Tap here to enable audio
            </p>
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-500/10" />
        </div>
      )}

      <button
        onClick={toggleSound}
        className="absolute mx-2 top-[13%] md:top-[12%] md:right-[4%] z-50 p-2 sm:p-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-full transition-colors"
        aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
      >
        {isSoundEnabled ? (
          <Volume2 className="sm:w-6 sm:h-6 text-amber-500" />
        ) : (
          <VolumeX className="sm:w-6 sm:h-6 text-amber-500" />
        )}
      </button>

      {/* Heading Section */}
      <div className="mt-12 mb-12 mx-auto flex flex-col items-center gap-2 px-10">
        <h1 className="relative font-life-craft text-center text-5xl tracking-wider text-white">
          OUR SPONSORS
          <div className="absolute -inset-4 -z-10 animate-pulse rounded-lg bg-emerald-900/50 blur-lg" />
        </h1>
        <p className="font-black-chancery text-center text-lg text-gray-100">
          Big names backing an extraordinary fest
        </p>
      </div>
      <div className="h-5" />

      {/* Carousel Section */}
      <div className="flex-1">
        {sponsors && sponsors.length > 0 ?
          <SponsorGearCarousel
            sponsors={sponsors}
            isSoundEnabled={isSoundEnabled}
            setIsSoundEnabled={setIsSoundEnabled}
          /> :
          <div className="size-full flex-col gap-10 flex h-[calc(100dvh-20rem)] text-4xl font-bold justify-center items-center text-yellow-100">
            <div>
              Looks like we are short on sponsors
            </div>
            <div className="flex justify-center items-center gap-4 flex-col text-white text-2xl">
              Would you like to sponsor us
              <Link href="/contact" className="underline">
                Contact us
              </Link>
            </div>
          </div>
        }
      </div>
      <div className="scroll-helper sm:mx-3 absolute left-1 sm:left-auto  top-[36%] lg:right-12  -translate-y-1/2 flex flex-col items-center gap-3 text-amber-500 z-10">
        <p
          className="text-[0.7rem] sm:text-[0.9rem] font-medium writing-mode-vertical rotate-180 transform lg:rotate-0"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll down here to explore more sponsors
        </p>
        <MousePointerClick className="w-4 h-4 sm:w-6 sm:h-6" />
        <ArrowDown className="w-4 h-4 sm:w-6 sm:h-6" />
      </div>
      {/* Footer Spacing */}
      <div className="h-16" />
    </main>
  );
};

export default Page;

export { getStaticProps }
