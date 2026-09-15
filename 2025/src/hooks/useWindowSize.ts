import { useState, useEffect } from "react";

export default function useWindowSize() {
  const hasWindow = typeof window !== "undefined";

  const [windowDimensions, setWindowDimensions] = useState({
    width: hasWindow ? window.innerWidth : null,
    height: hasWindow ? window.innerHeight : null,
  });

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () =>
        setWindowDimensions({
          width: hasWindow ? window.innerWidth : null,
          height: hasWindow ? window.innerHeight : null,
        });

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
