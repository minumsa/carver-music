import { useAtom } from "jotai";
import { scrollPositionAtom } from "../modules/atoms";
import { useEffect } from "react";

const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom);

export default function useScrollReset() {
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
