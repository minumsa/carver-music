import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
import styles from "./LandingPage.module.css";

interface LoadingIconProps {
  isLoading: boolean;
}

export const LoadingIcon = ({ isLoading }: LoadingIconProps) => {
  return isLoading && <SpinningCircles className={styles.spinningCircles} />;
};
