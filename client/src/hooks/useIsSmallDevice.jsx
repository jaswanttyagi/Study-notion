import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export default function useIsSmallDevice() {
  const getIsSmallDevice = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= MOBILE_BREAKPOINT;
  };

  const [isSmallDevice, setIsSmallDevice] = useState(getIsSmallDevice);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(getIsSmallDevice());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isSmallDevice;
}
