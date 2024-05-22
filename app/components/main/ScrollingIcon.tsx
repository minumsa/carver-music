import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
import styles from "./Grid.module.css";
import { useEffect, useState } from "react";
import { scrollCountAtom } from "@/app/modules/atoms";
import { useAtomValue } from "jotai";

interface LoadingIconProps {
  isScrolling: boolean;
}

export const ScrollingIcon = ({ isScrolling }: LoadingIconProps) => {
  const [displayStatus, setDisplayStatus] = useState("none");
  const scrollCount = useAtomValue(scrollCountAtom);
  const isFirstScroll = scrollCount < 3;
  const showIconTime = isFirstScroll ? 1500 : 1000;

  // LoadingIcon이 금방 사라져서 사용자가 인지하지 못할 경우를 대비해 1초 더 노출
  useEffect(() => {
    if (isScrolling) {
      setDisplayStatus("flex");
      setTimeout(() => {
        setDisplayStatus("none");
      }, showIconTime);
    }
  }, [isScrolling, showIconTime]);

  return (
    <div style={{ display: displayStatus }}>
      <SpinningCircles className={styles.spinningCircles} />
    </div>
  );
};
