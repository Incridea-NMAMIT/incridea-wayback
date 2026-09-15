import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
import Modal from "../gallery-modal";
import PreviewComponent from "../previewComponent/preview-component";
import { CONSTANT } from "~/constants";

gsap.registerPlugin(Draggable, MotionPathPlugin);

const Inc24 = ({ imgArr }: { imgArr: string[] }) => {
  const [queue, setQueue] = useState<string[]>(imgArr);
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [motionCoordinates, setMotionCoordinates] = useState<
    { x: number; y: number }[]
  >([
    { x: 0, y: -200 },
    { x: 100, y: -400 },
    { x: 300, y: -600 },
    { x: 500, y: -800 },
    { x: 800, y: -1000 },
  ]);
  const imageRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isDraggingRef = useRef(false);

  const createMotionPathAnimation = useMemo(
    () => (target: HTMLDivElement, index: number) => {
      const animation = gsap
        .timeline()
        .fromTo(
          target,
          { x: 0, y: 100, opacity: 0 },
          { x: 0, y: 200, opacity: 1, duration: 1, ease: "power2.out" },
        )
        .to(target, {
          motionPath: {
            path: [
              {
                x: (motionCoordinates[0]?.x ?? 0) * (index % 2 === 0 ? -1 : 1),
                y: motionCoordinates[0]?.y ?? -200,
              },
              {
                x:
                  (motionCoordinates[1]?.x ?? 100) * (index % 2 === 0 ? -1 : 1),
                y: motionCoordinates[1]?.y ?? -400,
              },
              {
                x:
                  (motionCoordinates[2]?.x ?? 300) * (index % 2 === 0 ? -1 : 1),
                y: motionCoordinates[2]?.y ?? -600,
              },
              {
                x:
                  (motionCoordinates[3]?.x ?? 500) * (index % 2 === 0 ? -1 : 1),
                y: motionCoordinates[3]?.y ?? -800,
              },
              {
                x:
                  (motionCoordinates[4]?.x ?? 800) * (index % 2 === 0 ? -1 : 1),
                y: motionCoordinates[4]?.y ?? -1000,
              },
            ],
            curviness: 2,
          },
          opacity: 1,
          duration: 28,
          ease: "power2.out",
          onComplete: () => {
            setQueue((prevQueue) =>
              prevQueue.filter((img) => img !== target.dataset.img),
            );
          },
        })
        .to(target, {
          opacity: 0,
          duration: 3,
        });

      return animation;
    },
    [motionCoordinates],
  );

  useEffect(() => {
    const handleResize = () => {
      let newCoordinates;
      if (window.innerWidth < 768) {
        newCoordinates = [
          { x: 0, y: -150 },
          { x: 60, y: -300 },
          { x: 120, y: -450 },
          { x: 220, y: -600 },
          { x: 380, y: -750 },
        ];
      } else if (window.innerWidth < 1024) {
        newCoordinates = [
          { x: 0, y: -200 },
          { x: 120, y: -400 },
          { x: 250, y: -600 },
          { x: 400, y: -800 },
          { x: 600, y: -1000 },
        ];
      } else {
        newCoordinates = [
          { x: 0, y: -250 },
          { x: 200, y: -500 },
          { x: 500, y: -750 },
          { x: 900, y: -1000 },
          { x: 1400, y: -1400 },
        ];
      }

      setMotionCoordinates(newCoordinates);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const extendedImgArr = [
      ...structuredClone(imgArr),
      ...structuredClone(imgArr),
      ...structuredClone(imgArr),
      ...structuredClone(imgArr),
      ...structuredClone(imgArr),
    ];
    setQueue(extendedImgArr);

    animationTimelineRef.current?.clear();
    animationTimelineRef.current = gsap.timeline({ repeat: -1 });

    const draggableInstances: Draggable[] = [];

    extendedImgArr.forEach((img, index) => {
      const imageRef = imageRefsMap.current.get(img);
      if (!imageRef) return;

      const draggable = Draggable.create(imageRef, {
        type: "x,y",
        onDragEnd: function () {
          const angle = Math.atan2(
            this.deltaY as number,
            this.deltaX as number,
          );
          const force = 2000;
          const xTarget = Math.cos(angle) * force;
          const yTarget = Math.sin(angle) * force;

          gsap.to(imageRef, {
            x: xTarget,
            y: yTarget,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
              animationTimelineRef.current?.resume();
            },
          });
        },
        onRelease: function () {
          isDraggingRef.current = false;
          setTimeout(() => {
            if (!isDraggingRef.current) {
              gsap.set(imageRef, { x: 0, y: 100, opacity: 0 });

              const newAnimation = createMotionPathAnimation(imageRef, index);
              animationTimelineRef.current?.add(newAnimation, "+=0.5");
              animationTimelineRef.current?.resume();
            }
          }, 2000);
        },
      })[0];

      if (draggable) {
        draggableInstances.push(draggable);
      }

      const imageAnimation = createMotionPathAnimation(imageRef, index);
      animationTimelineRef.current?.add(imageAnimation, index * 2);
    });

    animationTimelineRef.current.play();

    return () => {
      draggableInstances.forEach((instance) => instance.kill());

      animationTimelineRef.current?.kill();
    };
  }, [imgArr, motionCoordinates, createMotionPathAnimation]);

  const setImageRef = (img: string) => (el: HTMLDivElement | null) => {
    if (el) {
      imageRefsMap.current.set(img, el);
    }
  };

  const handleClick = (index: number) => {
    setActiveIndex(index % 26);
    setActiveModal(true);
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img
        src="/2025/gallery/portal3.gif"
        alt=""
        className="absolute -bottom-20 scale-y-[2] scale-x-150 lg:scale-x-100 -translate-y-1/2 h-40 w-full "
      /> */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img
        src="/2025/gallery/portal3-bottom.gif"
        alt=""
        className="absolute -bottom-20 scale-x-150 lg:scale-x-100 h-40 w-full z-[99999]"
      /> */}
      <div className="relative flex justify-center items-center h-screen translate-y-2/3">
        {queue.map((img, index) => (
          // <div
          //   key={index}
          //   ref={setImageRef(img)}
          //   onClick={() => handleClick(index)}
          //   className="absolute h-[160px] sm:h-[220px] lg:h-[300px] sm:p-[20px] translate-y-2/3 aspect-square bg-[#dedcdc] shadow-lg cursor-grab active:cursor-grabbing"
          // >
          //   <img
          //     src={img}
          //     className="aspect-square border-black border"
          //     alt={`Inc 2022 ${index}`}
          //   />
          // </div>
          // eslint-disable-next-line @next/next/no-img-element
          <img
            rel="preload"
            key={index}
            ref={setImageRef(img)}
            src={img}
            onClick={() => handleClick(index)}
            className="absolute h-[160px] sm:h-[220px] lg:h-[280px] rounded-lg translate-y-1/3 aspect-square bg-[#dedcdc] shadow-lg cursor-grab active:cursor-grabbing"
            alt={`Inc 2022 ${index}`}
          />
        ))}
        <Modal
          showModal={activeModal}
          title="Gallery"
          onClose={() => setActiveModal(false)}
        >
          <PreviewComponent
            imgArr={imgArr}
            index={activeIndex}
            afterMovieLink="YoWeuaSMytk"
            thumbnailSrc={CONSTANT.ASSETS.GALLERY.THUMBNAIL24}
          />
        </Modal>
      </div>
    </>
  );
};

export default Inc24;
