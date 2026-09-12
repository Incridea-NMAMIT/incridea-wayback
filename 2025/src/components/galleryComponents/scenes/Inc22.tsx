import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import Image from "next/image";
import Modal from "../gallery-modal";
import PreviewComponent from "../previewComponent/preview-component";
import { CONSTANT } from "~/constants";

gsap.registerPlugin(Draggable);

const Inc22 = ({ imgArr }: { imgArr: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentItem, setCurrentItem] = useState(0);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const handleClick = (index: number) => {
    setActiveIndex(index % 26);
    setActiveModal(true);
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const items = gsap.utils.toArray<HTMLElement>(
      containerRef.current.querySelectorAll(".stack-item"),
    );

    const offset = 20;

    function updatePositions() {
      items.forEach((item, i) => {
        const zIndex = imgArr.length - (i + currentItem);
        gsap.set(item, {
          duration: isFirstMount ? 0 : 0.2,
          x: offset * i,
          y: -offset * i,
          zIndex: zIndex,
          scale: 1 - i * 0.05,
          opacity: i < 3 ? 1 : 0,
          ease: "power2.out",
          onComplete: () => {
            if (isFirstMount && i === items.length - 1) {
              setIsFirstMount(false);

              items.forEach((el) => {
                gsap.set(el, { visibility: "visible" });
              });
            }
          },
        });
      });
    }

    function makeTopItemDraggable() {
      if (!items.length) return;

      const topItem = containerRef.current!.firstElementChild as HTMLElement;

      Draggable.get(topItem)?.kill();

      Draggable.create(topItem, {
        type: "x,y",

        onDragEnd: function (this: Draggable) {
          const direction = this.getDirection("start");

          if (direction == "left") {
            gsap.to(topItem, {
              x: "-100vw",
              opacity: 0,
              duration: 0.2,
              ease: "power1.in",
              onComplete: () => {
                setCurrentItem((prev) => (prev + 1) % imgArr.length);

                containerRef.current!.appendChild(topItem);

                updatePositions();
              },
            });
          } else {
            /* gsap.to(topItem, {
              x: "100vw",
              duration: 0.5,
            }); */
            gsap.to(topItem, {
              x: "100vw",
              opacity: 0,
              duration: 0.2,
              ease: "power1.in",
              onComplete: () => {
                setCurrentItem((prev) => (prev + 1) % imgArr.length);

                containerRef.current!.appendChild(topItem);

                updatePositions();
              },
            });
          }
        },
      });
    }

    updatePositions();
    makeTopItemDraggable();

    return () => {
      items.forEach((item) => {
        Draggable.get(item)?.kill();
      });
    };
  }, [currentItem, imgArr, isFirstMount]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center md:top-[3%]"
    >
      {imgArr.map((img, index) => (
        <div
          key={index}
          className="absolute transform transition-all duration-300 ease-in-out stack-item
          top-[15%] "
        >
          <div className="relative translate-y-[10%] right-[8%] w-[90vw] sm:w-[200vw] h-[100vh] sm:h-[50vh] max-w-[1000px] max-h-[800px] sm:translate-y-[70%] sm:right-[4%]">
            <Image
              src={CONSTANT.ASSETS.GALLERY.TABLET}
              alt="Tablet frame"
              layout="fill"
              objectFit="contain"
              className="pointer-events-none"
            />

            <div className="absolute inset-10 flex justify-center items-center">
              <img
                rel="preload"
                className="object-fit"
                src={img}
                alt={`Image ${index + 1}`}
                height={200}
                width={200}
                onClick={() => handleClick(index)}
                style={{
                  height: "190px",
                  width: "160px",
                  zIndex: 0,
                  opacity: 0.9,
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              />
            </div>
          </div>
          <Modal
            showModal={activeModal}
            title="Gallery"
            onClose={() => setActiveModal(false)}
          >
            <PreviewComponent
              imgArr={imgArr}
              index={activeIndex}
              afterMovieLink="JHgT5PzLc4Q"
              thumbnailSrc={CONSTANT.ASSETS.GALLERY.THUMBNAIL22}
            />
          </Modal>
        </div>
      ))}
    </div>
  );
};

export default Inc22;
