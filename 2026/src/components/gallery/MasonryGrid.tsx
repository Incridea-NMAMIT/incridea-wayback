import React, { useState, useMemo, useRef } from "react";
import Masonry from "@mui/lab/Masonry";
import { motion } from "framer-motion";
import MasonryGlassCard from "./MasonryGlassCard";
import LiquidGlassCard from "../liquidglass/LiquidGlassCard";
import { ImageWithSkeleton } from "./Skeleton";
import ImageModal from "./ImageModal";
import { useTask } from "../../hooks/useTask";
import { useAuth } from "../../hooks/useAuth";

interface GalleryItem {
  id: string;
  url: string;
  ratio: string;
}

interface GallerySection {
  year: string;
  images: GalleryItem[];
}

interface MasonryGridProps {
  sections: GallerySection[];
  rotation: number;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ sections, rotation }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const { completeTask } = useTask();
  const { user } = useAuth();

  // Track viewed images session-wide
  const viewedImages = useRef<Set<string>>(new Set());

  // Flatten all images for easy navigation
  const allImages = useMemo(() => {
    return sections.flatMap((section) => section.images);
  }, [sections]);

  const handleImageClick = (imageId: string) => {
    const index = allImages.findIndex((img) => img.id === imageId);
    if (index !== -1) {
      setSelectedImageIndex(index);

      const isCompleted = user?.completedTasks?.some(t => t.taskId === 'c1r6p5j3');
      if (!isCompleted) {
        viewedImages.current.add(imageId);
        console.log(`Viewed ${viewedImages.current.size} photos`);
        if (viewedImages.current.size >= 6) {
          void completeTask('c1r6p5j3');
        }
      }
    }
  };

  const handleNext = () => {
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < allImages.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <div
        className="w-full flex flex-col items-center pt-52 origin-top"
        style={{
          transform: `rotateY(${rotation}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s linear",
          willChange: "transform",
        }}
      >
        {sections.map((section) => (
          <section key={section.year} className="max-w-6xl mx-auto w-full">
            <LiquidGlassCard
              className="px-4 sm:px-4 mb-32 relative p-3 sm:p-8"
            >
              {/* Header: Tech/Space Themed */}
              <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
                <div className="w-2 h-8 bg-cyan-400 rounded-full shadow-[0_0_15px_cyan]" />
                <motion.h1
                  className="font-sans font-bold text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-tight inline-block px-3 sm:px-4 py-1"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {section.year}
                </motion.h1>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <Masonry
                columns={{ xs: 2, sm: 3, lg: 4 }}
                spacing={2}
                sx={{ margin: "0 auto" }}
              >
                {section.images.map((item) => (
                  <MasonryGlassCard
                    key={item.id}
                    ratio={item.ratio}
                    onClick={() => handleImageClick(item.id)}
                  >
                    <ImageWithSkeleton src={item.url} alt={item.id} />
                  </MasonryGlassCard>
                ))}
              </Masonry>
            </LiquidGlassCard>
          </section>
        ))}
      </div>

      {/* Lightbox Modal */}
      <ImageModal
        isOpen={selectedImageIndex !== null}
        imageUrl={
          selectedImageIndex !== null ? allImages[selectedImageIndex].url : ""
        }
        onClose={handleClose}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={
          selectedImageIndex !== null &&
          selectedImageIndex < allImages.length - 1
        }
        hasPrev={selectedImageIndex !== null && selectedImageIndex > 0}
      />
    </>
  );
};

export default MasonryGrid;
