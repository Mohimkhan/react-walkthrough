import { useContext } from "react";
import { WalkthroughContext, WalkthroughStep } from "../providers/index";
import { sleep } from "../utils";
import {
  DEFAUTL_DURATION_OF_STEP_VISIBILITY,
  TOUR_CONTAINER_ID,
} from "../constant";

type simulateStepParams = {
  step: WalkthroughStep;
  automatic: Boolean;
  index: number;
  stepsLen: number;
};

const useWalkThrough = () => {
  const context = useContext(WalkthroughContext);

  if (!context) {
    throw new Error("useWalkThrough must be used within a WalkThroughProvider");
  }

  const { givenTours, setGivenTours, automatic, setActiveStep } = context;

  const simulateStep = async ({
    index,
    step,
    stepsLen,
    automatic,
  }: simulateStepParams) => {
    if (!automatic) return;

    let container = document.getElementById(TOUR_CONTAINER_ID) as HTMLElement;

    if (!container) {
      console.error(
        `Element with the ID:${TOUR_CONTAINER_ID} was not found in the document body`
      );
      return;
    }

    if (index === 0) {
      setActiveStep(step);
      console.log(`Step ${step?.id} is started!`);
      return;
    }

    await sleep({
      delay: step?.duration ?? DEFAUTL_DURATION_OF_STEP_VISIBILITY,
    });

    console.log(`Step ${step?.id} is started!`);

    setActiveStep(step);

    if (index === stepsLen - 1) {
      // so that the step doesn't vanished immediately
      await sleep({
        delay: step?.duration ?? DEFAUTL_DURATION_OF_STEP_VISIBILITY,
      });

      container.remove();
    }
  };

  const startTour = async (tourName?: string) => {
    // check if tours are present
    if (!givenTours || givenTours.length === 0) {
      console.error("React-Walkthrough: No tours provided.");
      return;
    }

    let activeTour;
    if (tourName) {
      activeTour = givenTours.find((t) => t.name === tourName);
    } else {
      activeTour = givenTours[0]; // Default to first
    }

    if (!activeTour) {
      console.error(`React-Walkthrough: Tour "${tourName}" not found.`);
      return;
    }

    // check if active tour has valid steps
    if (!activeTour.steps || activeTour.steps.length === 0) {
      console.error(`React-Walkthrough: ${tourName} has no steps.`);
      return;
    }

    let container = document.getElementById(TOUR_CONTAINER_ID) as HTMLElement;
    if (!container) {
      console.warn(
        `React-Walkthrough: #${TOUR_CONTAINER_ID} missing. Creating it automatically...`
      );
      container = document.createElement("div");
      container.id = TOUR_CONTAINER_ID;
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.pointerEvents = "none";
      container.style.zIndex = "9999";
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
      container.style.backdropFilter = "blur(2px)";
      document.body.appendChild(container);
    } else {
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.pointerEvents = "none";
      container.style.zIndex = "9999";
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
      container.style.backdropFilter = "blur(2px)";
    }

    console.log("Starting Tour:", activeTour.name);

    const steps = activeTour?.steps;
    const stepsLen = activeTour?.steps?.length;

    for (let i = 0; i < stepsLen; i++) {
      await simulateStep({
        index: i,
        stepsLen,
        step: steps[i],
        automatic: automatic ?? true,
      });
    }
  };

  return {
    startTour,
  };
};

export { useWalkThrough };
