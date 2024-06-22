import React, { useState } from "react";
import styles from "./AlbumArtCard.module.css";

interface AlbumArtCardProps {
  link: string;
  imgUrl: string;
}

export const AlbumArtCard = ({ link, imgUrl }: AlbumArtCardProps) => {
  const [overlayStyle, setOverlayStyle] = useState({});
  const [containerStyle, setContainerStyle] = useState({});

  const handleMouseMove = (e: { nativeEvent: { offsetX: number; offsetY: number } }) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const rotateY = (-1 / 10) * x + 10;
    const rotateX = (2 / 30) * y - 10;

    setOverlayStyle({
      backgroundPosition: `${x / 5 + y / 5}%`,
      filter: `opacity(${x / 200}) brightness(1.2)`,
    });

    setContainerStyle({
      transform: `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseOut = () => {
    setOverlayStyle({
      filter: "opacity(0)",
    });

    setContainerStyle({
      transform: "perspective(350px) rotateY(0deg) rotateX(0deg)",
    });
  };

  return (
    <a href={link} target="_blank">
      <div
        className={styles.albumImageContainer}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        style={containerStyle}
      >
        <div className={styles.albumImageOverlay} style={overlayStyle}></div>

        <div className={styles.albumImage} style={{ backgroundImage: `url(${imgUrl})` }} />
      </div>
    </a>
  );
};
