import React, { useEffect } from "react";
import lottie from "lottie-web/build/player/lottie_light";
import loadingCircles from "../public/loadingBouncingCirclesGreen.json";
import styles from "./index.module.css";

export default function LoadingSpinner() {
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#loadingCircles"),
      animationData: loadingCircles,
      renderer: "svg",
      loop: true,
      autoplay: true,
    });
  }, []);

  return (
    <div>
      <div id="loadingCircles" className={styles.spinnerContainer} />
    </div>
  );
}
