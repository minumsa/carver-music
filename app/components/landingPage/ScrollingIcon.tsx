import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
import styles from "./LandingPage.module.css";
import { useEffect, useState } from "react";

interface LoadingIconProps {
  isScrolling: boolean;
}

export const ScrollingIcon = ({ isScrolling }: LoadingIconProps) => {
  const [displayStatus, setDisplayStatus] = useState("none");

  useEffect(() => {
    if (isScrolling) {
      setDisplayStatus("flex");
    } else {
      setDisplayStatus("none");
    }
  }, [isScrolling]);

  return (
    <div style={{ display: displayStatus }}>
      <SpinningCircles className={styles.spinningCircles} />
    </div>
  );
};
