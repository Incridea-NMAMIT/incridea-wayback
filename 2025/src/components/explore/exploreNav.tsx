import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Button from "~/components/button";
import { CONSTANT } from "~/constants";
import { GetStoneVisibilitiesDocument } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

export default function ExploreNav() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { data: userStones, loading: userStonesLoading } = useQuery(
    GetStoneVisibilitiesDocument,
    {},
  );
  const [stones, setStones] = useState<string>("111111");

  useEffect(() => {
    const handleOnEscapeDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") setShowModal(!showModal);
    };

    window.addEventListener("keydown", handleOnEscapeDown);

    return () => {
      window.removeEventListener("keydown", handleOnEscapeDown);
    };
  }, [showModal]);

  useEffect(() => {
    if (
      userStones?.getStoneVisibilities.__typename ===
      "QueryGetStoneVisibilitiesSuccess"
    ) {
      const str = userStones.getStoneVisibilities.data; // Ensure this exists
      if (str) {
        const boolArray = str
          .slice(0, 6)
          .split("")
          .map((char) => char === "1");
        localStorage.setItem("stoneVisibility", JSON.stringify(boolArray));
      }
    }

    const interval = setInterval(() => {
      const storedVisibility = localStorage.getItem("stoneVisibility");
      if (storedVisibility) {
        const parsedVisibility = JSON.parse(storedVisibility) as boolean[];
        const total = parsedVisibility.length;
        const collected = parsedVisibility.filter((v) => !v).length;
        setStones(`${collected}/${total}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userStonesLoading, userStones]);

  return (
    <>
      <div className="fixed z-[1000] flex w-full items-center justify-between p-4">
        {user ? (
          <div className="flex flex-row items-center space-x-1 text-white">
            <Image
              src={CONSTANT.ASSETS.EXPLORE.STONE}
              width={100}
              height={100}
              alt="map"
              className="h-8 w-8 sm:h-10 sm:w-10"
            />

            <p className="relative text-xl">{stones}</p>
          </div>
        ) : (
          <div></div>
        )}
        <Button
          intent={"primary"}
          size={"medium"}
          onClick={() => {
            // setShowModal(true);
            void router.push("/");
          }}
        >
          Home
        </Button>
      </div>
    </>
  );
}
