import { useScroll, useTransform } from "framer-motion";
import { type RefObject } from "react";

const useParallax = (ref: RefObject<HTMLElement>, speed: number) => {
  const { scrollYProgress } = useScroll({ target: ref });
  const transform = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);

  return transform;
};
export default useParallax;
