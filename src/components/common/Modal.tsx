import React from "react";
import { WalkthroughStep } from "../../providers";

type ModalProps = {
  step: WalkthroughStep;
};

const Modal: React.FC<ModalProps> = ({ step }) => {
  return (
    <div
      className={`modal bg-black/40 flex justify-center items-center relative inset-0 w-full h-full`}
    >
      <div>
        <h2>{step?.title ?? "Title"}</h2>
        <p>{step?.description ?? "Description"}</p>

        <div className="buttonGroup">
          <button type="button">Previous</button>
          <button type="button">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
