import Image from "next/image";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  Autoplay,
  FreeMode,
  Mousewheel,
  Navigation,
  Thumbs,
} from "swiper/modules";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";

import BlurImage from "~/components/blurImage";
import { env } from "~/env";

const PreviewComponent = ({
  imgArr,
  index,
  afterMovieLink,
  afterMovieLinks,
  thumbnailSrc,
}: {
  imgArr?: string[];
  index?: number;
  afterMovieLink?: string;
  afterMovieLinks?: string[][];
  thumbnailSrc?: string;
}) => {
  const isMediumScreen = useMediaQuery({ query: "(min-width: 800px)" });
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [portraitImages, setPortraitImages] = useState<{
    [key: number]: boolean;
  }>({});

  const handleImageLoad = (
    index: number,
    event: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const isPortrait = naturalHeight > naturalWidth;

    setPortraitImages((prev) => ({
      ...prev,
      [index]: isPortrait,
    }));
  };
  return (
    <>
      <Swiper
        style={{
          //@ts-expect-error swiper css variables
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        initialSlide={index}
        mousewheel={true}
        modules={[Navigation, Autoplay, Mousewheel, FreeMode, Thumbs]}
        spaceBetween={10}
        navigation={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="h-[30vh] w-[90%] md:z-50 md:mt-[2vh] md:h-[80vh] md:w-[80%] md:border-none"
      >
        {afterMovieLinks?.map((link, index) => (
          <SwiperSlide
            key={index}
            className="flex h-full w-full cursor-pointer items-center justify-center bg-white text-center"
          >
            <div className="relative flex h-full w-full items-center justify-center">
              <iframe
                className="h-full w-full"
                title="Youtube player"
                allowFullScreen={true}
                sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
                src={link[1]}
              />
            </div>
          </SwiperSlide>
        )) ??
          imgArr?.map((img, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center bg-white text-center"
            >
              <div className="flex h-full w-full items-center justify-center">
                <BlurImage
                  fill
                  alt="Blurred Image"
                  src={img}
                  className="object-cover blur-xl"
                />
                <Image
                  fill
                  src={img}
                  alt="incridea"
                  className={`z-10 object-cover ${portraitImages[index] ? "object-scale-down" : ""}`}
                  priority
                  onLoad={(e) => handleImageLoad(index, e)}
                />
              </div>
            </SwiperSlide>
          ))}
        {!afterMovieLinks && imgArr && (
          <SwiperSlide
            key={imgArr.length}
            className="z-50 flex h-full w-full cursor-pointer items-center justify-center bg-white text-center"
          >
            <div className="relative z-50 flex h-full w-full items-center justify-center">
              <iframe
                className="h-full w-full"
                title="Youtube player"
                allowFullScreen={true}
                sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
                src={`https://www.youtube.com/embed/${afterMovieLink}?autoplay=1&playsinline=1&rel=0&fs=1&controls=1&mute=1`}
              ></iframe>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
      <Swiper
        mousewheel={true}
        onSwiper={(swiper) => setThumbsSwiper(swiper)}
        slidesPerView={!isMediumScreen ? 5 : 10}
        speed={500}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        autoplay={true}
        className="absolute h-[12vh] w-full md:z-50 md:mb-[2vh]"
      >
        {afterMovieLinks?.map((link, index) => (
          <SwiperSlide
            key={index}
            className="flex scale-90 items-center justify-center bg-black text-center opacity-50 transition-all duration-500"
          >
            <div className="flex h-full items-center justify-center">
              <Image
                fill
                src={link[0] ?? ""}
                alt="incridea"
                className="z-10 object-cover"
                priority
              />
            </div>
          </SwiperSlide>
        )) ??
          imgArr?.map((img, index) => (
            <SwiperSlide
              key={index}
              className="flex scale-90 items-center justify-center bg-black text-center opacity-50 transition-all duration-500"
            >
              <div className="flex h-full items-center justify-center">
                <Image
                  fill
                  src={env.NEXT_PUBLIC_UPLOADTHING_URL + img}
                  alt="incridea"
                  className="z-10 object-cover"
                  priority
                />
              </div>
            </SwiperSlide>
          ))}
        {!afterMovieLinks && (
          <SwiperSlide
            key={index}
            className="flex scale-90 items-center justify-center bg-black text-center opacity-50 transition-all duration-500"
          >
            <div className="flex h-full items-center justify-center">
              {/* <BlurImage
                    fill
                    alt="Blurred Image"
                    src={env.NEXT_PUBLIC_UPLOADTHING_URL+img}
                    className="object-cover blur-xl"
                  /> */}
              <Image
                fill
                src={thumbnailSrc ?? ""}
                alt="incridea"
                className={`z-10 object-cover`}
                priority
              />
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </>
  );
};

export default PreviewComponent;
