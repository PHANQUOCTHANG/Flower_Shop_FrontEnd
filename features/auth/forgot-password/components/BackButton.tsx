import React from "react";
import { ArrowLeft } from "lucide-react";
import { Step } from "./Stepper";

interface BackButtonProps {
  step: Step;
  isSubmitting: boolean;
  onBack: () => void;
}

export default function BackButton({
  step,
  isSubmitting,
  onBack,
}: BackButtonProps) {
  return (
    <>
      {step !== "success" && (
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 text-[#ee2b5b] text-sm font-black uppercase tracking-wider hover:opacity-80 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Quay lại {step === "email" ? " đăng nhập" : " bước trước"}
          </button>
        </div>
      )}
    </>
  );
}
