import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
import styles from "./Grid.module.css";
import { useEffect, useState } from "react";

interface LoadingIconProps {
  isScrolling: boolean;
}

export const ScrollingIcon = ({ isScrolling }: LoadingIconProps) => {
  const [displayStatus, setDisplayStatus] = useState("none");

  // LoadingIcon이 금방 사라져서 사용자가 인지하지 못할 경우를 대비해 1초 더 노출
  useEffect(() => {
    if (isScrolling) {
      setDisplayStatus("flex");
      setTimeout(() => {
        setDisplayStatus("none");
      }, 1000);
    }
  }, [isScrolling]);

  return (
    <div style={{ display: displayStatus }}>
      <SpinningCircles className={styles["spinning-circles"]} />
    </div>
  );
};
