import { useAtom } from "jotai";
import { scrollPositionAtom } from "../modules/atoms";
import { useEffect } from "react";

export function useResetScroll() {
  const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom);

  useEffect(() => {
    const scrolledBefore = scrollPosition > 0;

    function scrollReset() {
      window.scrollTo(0, scrollPosition);
      setScrollPosition(0);
    }

    if (scrolledBefore) {
      scrollReset();
    }
  }, []);
}
