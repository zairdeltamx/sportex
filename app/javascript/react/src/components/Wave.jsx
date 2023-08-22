import React, { useState, useEffect } from "react";
import wavePc from "../img/waves/wavePc.png";
import wavePad from "../img/waves/wave_ipad.png";
import waveMovil from "../img/waves/waveMobile.png";
import styles from "./Wave.module.css";
export const Wave = () => {
  const [wave, setWave] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1000) {
        setWave(wavePc);
      } else if (window.innerWidth >= 800) {
        setWave(wavePad);
      } else {
        setWave(waveMovil);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.containerImage}>
        <img width="100%" height="100%" src={wave} alt="" />
      </div>
    </div>
  );
};
