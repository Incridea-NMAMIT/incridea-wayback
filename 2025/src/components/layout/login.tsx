import Image from "next/image";
import React, {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CONSTANT } from "~/constants";

const LoginLayout = forwardRef(
  (
    {
      children,
    }: {
      children: ReactNode;
    },
    ref: ForwardedRef<{
      triggerGears: () => void;
    }>,
  ) => {
    const smallContainterRef = useRef<HTMLDivElement>(null);
    const largeContainerRef = useRef<HTMLDivElement>(null);

    const [smallContainerAngle, setSmallContainerAngle] = useState<number>(0);
    const [largeContainerAngle, setLargeContainerAngle] = useState<number>(0);

    const [smallContainterScale, setSmallGearScale] = useState<string>("1");
    const [largeContainerRadius, setLargeGearRadius] = useState<string>("0");

    const smallContainterStyle = useMemo(
      () => ({
        left: "42%",
        bottom: "80%",
        rotate: "18deg",
        transform: `rotate(${smallContainerAngle}deg)`,
        scale: smallContainterScale,
      }),
      [smallContainerAngle, smallContainterScale],
    );

    const largeContainerStyle = useMemo(
      () => ({
        top: "18%",
        width: largeContainerRadius,
        height: largeContainerRadius,
        transform: `rotate(${largeContainerAngle}deg)`,
      }),
      [largeContainerAngle, largeContainerRadius],
    );

    useImperativeHandle(ref, () => ({
      triggerGears: () => {
        console.log("called?");
        setSmallContainerAngle((prev) => prev + 360);
        setLargeContainerAngle((prev) => prev - 360);
      },
    }));

    useEffect(() => {
      const controller = new AbortController();

      const handleResize = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 600) {
          setLargeGearRadius("300vw");
          setSmallGearScale("1.4");
        } else if (screenWidth < 1400) {
          setLargeGearRadius("160vw");
          setSmallGearScale("1");
        } else if (screenWidth < 1500) {
          setLargeGearRadius("100vw");
          setSmallGearScale("1");
        } else {
          setLargeGearRadius("100vw");
          setSmallGearScale("1");
        }
      };

      handleResize();

      window.addEventListener("resize", handleResize, {
        signal: controller.signal,
      });
    }, []);

    return (
      <div className="size-full relative pt-16">
        <Image
          fill
          className="object-cover blur-[3px]"
          src={CONSTANT.ASSETS.LOGIN.BACKGROUND}
          alt="Login BG"
          priority
        />
        <div className="relative flex min-h-[73vh] h-screen flex-col justify-between overflow-hidden items-center [perspective:0px]">
          <div className="relative w-[500vw] h-[160vh] flex items-center justify-center">
            <div
              ref={smallContainterRef}
              style={smallContainterStyle}
              className="absolute scale-150 size-[80vw] translate-y-1/2 duration-login ease-in-out transition-transform"
            >
              <div className="relative size-full">
                <Image
                  src={CONSTANT.ASSETS.LOGIN.GEAR}
                  alt="Gear"
                  fill
                  priority
                />
              </div>
            </div>
            <div
              ref={largeContainerRef}
              style={largeContainerStyle}
              className="fixed translate-y-1/2 h-full scale-[1.85] duration-login ease-in-out transition-transform"
            >
              <div className="absolute size-full">
                <Image
                  src={CONSTANT.ASSETS.LOGIN.GEAR}
                  alt="Gear"
                  priority
                  fill
                />
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

LoginLayout.displayName = "LoginLayout";

export default LoginLayout;
