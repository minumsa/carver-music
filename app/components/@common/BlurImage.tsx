import React, { useState, useCallback } from "react";
import { useBlurhash } from "../../modules/useHash";
import { useInView } from "react-intersection-observer";

interface BlurImgProps {
  loading?: "lazy" | "eager" | undefined;
  blurHash: string | null;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  [key: string]: any;
}

export function BlurImg({
  loading = "lazy",
  blurHash,
  style,
  ...props
}: BlurImgProps): JSX.Element {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [ref, inView] = useInView({ rootMargin: "110%" });
  const blurUrl = useBlurhash(blurHash ? blurHash : "", props.width || 100, props.height || 100);

  const handleOnLoad = useCallback(() => {
    setImgLoaded(true);
  }, []);

  const newStyle: React.CSSProperties | undefined = blurUrl
    ? {
        ...style,
        backgroundImage: `url("${blurUrl}")`,
        backgroundSize:
          props.width && props.height ? `${props.width}px ${props.height}px` : "100% 100%",
      }
    : style;

  return (
    <img
      alt="Blur hash"
      ref={ref}
      {...props}
      loading={loading}
      onLoad={handleOnLoad}
      style={newStyle}
    />
  );
}
