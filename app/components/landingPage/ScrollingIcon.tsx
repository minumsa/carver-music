import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
import styles from "./LandingPage.module.css";

interface LoadingIconProps {
  isScrolling: boolean;
}

export const ScrollingIcon = ({ isScrolling }: LoadingIconProps) => {
  return isScrolling && <SpinningCircles className={styles.spinningCircles} />;
};
