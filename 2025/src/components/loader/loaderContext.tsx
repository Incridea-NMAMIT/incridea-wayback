import React, { createContext, useEffect, useState } from "react";
import BlackHoleLoader from "./blackholeLoader";
import gsap from "gsap";
import { useRouter } from "next/router";

type LoaderContextType = {
  show: "loading" | "show" | "hide";
  animateOverlay: boolean;
  setShow: (value: "loading" | "show" | "hide") => void;
  setAnimate: (value: boolean) => void;
};

export const LoaderContext = createContext<LoaderContextType | null>(null);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState<"loading" | "show" | "hide">(
    "hide",
  );
  const [animate, setAnimate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.sessionStorage.getItem("black-hole-loader") === "true") {
        setShowLoader("hide");
        gsap.set("#black-hole-overlay", {
          display: "none",
        });
      } else {
        if (router.pathname !== "/") {
          setShowLoader("hide");
        } else {
          setShowLoader("show");
        }
      }
    }
  }, [router.pathname]);

  useEffect(() => {
    if (router.pathname !== "/") {
      gsap.set("#black-hole-overlay", { display: "none" });
      return;
    }
    if (showLoader === "hide" && animate) {
      gsap.fromTo(
        "#black-hole-overlay",
        {
          display: "block",
          opacity: 1,
          delay: 0,
          backgroundColor: "black",
        },
        {
          opacity: 0,
          backgroundColor: "#00331f",
          duration: 0.3,
          display: "none",
        },
      );
    }
  }, [showLoader, animate]);

  return (
    <>
      {(showLoader === "show" || animate) && (
        <div
          className="w-screen h-screen bg-black fixed top-0 left-0 z-[999999]"
          id="black-hole-overlay"
        ></div>
      )}
      {showLoader === "hide" ? (
        <>{children}</>
      ) : showLoader === "show" && router.pathname === "/" ? (
        <LoaderContext.Provider
          value={{
            show: showLoader,
            animateOverlay: false,
            setShow: setShowLoader,
            setAnimate: setAnimate,
          }}
        >
          <BlackHoleLoader />
        </LoaderContext.Provider>
      ) : null}
      {/** null */}
    </>
  );
}
