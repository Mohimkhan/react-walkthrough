import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Modal from "../components/common/Modal";

// individual step type
export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  highlightElement?: ReactNode;
  hightLightElementID?: string;
  modal?: ReactNode;
  duration?: number;
}

// context type
export interface WalkthroughContextType {
  givenTours: WalkthroughTour[];
  setGivenTours: Dispatch<SetStateAction<WalkthroughTour[]>>;
  automatic?: Boolean;
  activeStep: WalkthroughStep | null;
  setActiveStep: Dispatch<SetStateAction<WalkthroughStep | null>>;
}

export interface WalkthroughTour {
  name: string; // should be unique
  description?: string;
  steps: WalkthroughStep[];
}

// provider props
export interface WalkthroughProviderProps {
  children: ReactNode;
  tours: WalkthroughTour[];
  automatic: Boolean;
}

const WalkthroughContext = createContext<WalkthroughContextType>({
  givenTours: [],
  setGivenTours: () => {},
  automatic: true,
  activeStep: null,
  setActiveStep: () => {},
});

const WalkThroughProvider: React.FC<WalkthroughProviderProps> = ({
  children,
  tours = [],
  automatic = true,
}) => {
  const [givenTours, setGivenTours] = useState<WalkthroughTour[]>(tours);
  const [activeStep, setActiveStep] = useState<WalkthroughStep | null>(null);

  return (
    <WalkthroughContext
      value={{
        givenTours,
        setGivenTours,
        automatic,
        activeStep,
        setActiveStep,
      }}
    >
      {children}

      {activeStep &&
        activeStep.modal &&
        createPortal(
          activeStep?.modal ?? <Modal step={activeStep} />,
          document.getElementById("tour-modal-container") as HTMLElement ?? document.body
        )}
    </WalkthroughContext>
  );
};

export { WalkthroughContext, WalkThroughProvider };
