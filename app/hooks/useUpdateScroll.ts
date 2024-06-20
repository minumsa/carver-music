import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isScrollingAtom, scrollCountAtom, totalScrollCountAtom } from "../modules/atoms";
import { useEffect } from "react";

export function useUpdateScroll(inView: boolean) {
  const [scrollCount, setScrollCount] = useAtom(scrollCountAtom);
  const newTotalScrollCount = useAtomValue(totalScrollCountAtom);
  const setIsScrolling = useSetAtom(isScrollingAtom);

  useEffect(() => {
    const isScrollAtOrBelowLimit = scrollCount <= newTotalScrollCount;
    if (inView) {
      if (isScrollAtOrBelowLimit) {
        setScrollCount((prevCount) => prevCount + 1);
        setIsScrolling(true);
      }
    }
  }, [inView]);
}
