import Image from "next/image";
import { type FunctionComponent, useState } from "react";
import { cn } from "~/lib/utils";

type BlurImageProps = {
  alt: string;
  src: string;
  fill: boolean;
  style?: React.CSSProperties;
  className?: string;
  priority?: boolean;
};

const BlurImage: FunctionComponent<BlurImageProps> = (props) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      {...props}
      alt={props.alt}
      className={cn(
        "duration-700 ease-in-out",
        props.className,
        isLoading
          ? "scale-110 blur-lg grayscale"
          : "scale-100 blur-0 grayscale-0",
      )}
      onLoadingComplete={() => setLoading(false)}
    />
  );
};

export default BlurImage;
