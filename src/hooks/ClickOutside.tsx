import { MutableRefObject, useCallback, useEffect, useRef } from "react";

export function useOutsideClick<T>(callback: () => void) {
  const ref = useRef<T>(null);
  const cback = useCallback(callback, []);

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (
        ref?.current &&
        //@ts-ignore
        !ref.current.contains(event.target)
      ) {
        cback();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return ref;
}
