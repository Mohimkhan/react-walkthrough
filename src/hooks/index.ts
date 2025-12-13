import { useContext } from "react";
import { WalkthroughContext, WalkthroughStep } from "../providers/index";
import { sleep } from "../utils";
import { DEFAUTL_DURATION_OF_STEP_VISIBILITY } from "../constant";

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

    let container = document.getElementById(
      "tour-modal-container"
    ) as HTMLElement;

    if (!container) {
      console.error(
        `Element with the ID:tour-modal-container was not found in the document body`
      );
      return;
    }

    if (index === 0) {
      setActiveStep(step);
      return;
    }

    await sleep({
      delay: step?.duration ?? DEFAUTL_DURATION_OF_STEP_VISIBILITY,
    });

    setActiveStep(step);

    if (index === stepsLen - 1) {
      await sleep({
        delay: 1000,
      });
      container.children[0].remove();
      container.removeAttribute("style");
    }

    console.log(`Step ${step?.id} is finished!`);
  };

  const startTour = async (tourName?: string) => {
    // Logic 1: Check if tours exist
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

    if (!activeTour.steps || activeTour.steps.length === 0) {
      console.error(`React-Walkthrough: ${tourName} has no steps.`);
      return;
    }

    let container = document.getElementById(
      "tour-modal-container"
    ) as HTMLElement;
    if (!container) {
      console.warn(
        "React-Walkthrough: #tour-modal-container missing. Creating it automatically..."
      );
      container = document.createElement("div");
      container.id = "tour-modal-container";
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
        automatic: true,
      });
    }
  };

  return {
    startTour,
    tours: givenTours,
    automatic,
  };
};

export { useWalkThrough };
