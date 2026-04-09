import React, { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";

export type Step = "email" | "otp" | "reset" | "success";

interface StepperProps {
 currentStep: Step;
}

export default function Stepper({ currentStep }: StepperProps) {
 const steps = useMemo(
 () => [
 { id: 1, label: "Email" },
 { id: 2, label: "OTP" },
 { id: 3, label: "Mật khẩu" },
 ],
 [],
 );

 const getStepStatus = (stepId: number) => {
 const stepMap = { 1: "email", 2: "otp", 3: "reset" } as Record<
 number,
 Step
 >;
 const stepOrder = { email: 1, otp: 2, reset: 3, success: 3 } as Record<
 Step,
 number
 >;

 const currentStepOrder = stepOrder[currentStep];
 const isActive = stepOrder[stepMap[stepId]] === currentStepOrder;
 const isDone = stepOrder[stepMap[stepId]] < currentStepOrder;

 return { isActive, isDone };
 };

 return (
 <div className="flex justify-center items-center gap-2 mb-10">
 {steps.map((step, index) => {
 const { isActive, isDone } = getStepStatus(step.id);

 return (
 <React.Fragment key={step.id}>
 <div
 className={`size-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-sm ${
 isActive
 ? "bg-[#ee2b5b] text-white scale-110 shadow-[#ee2b5b]/30"
 : isDone
 ? "bg-[#ee2b5b]/20 text-[#ee2b5b]"
 : "bg-slate-100 text-slate-400"
 }`}
 title={step.label}
 >
 {isDone ? <CheckCircle2 size={16} /> : step.id}
 </div>
 {index < steps.length - 1 && (
 <div
 className={`h-0.5 w-8 rounded-full transition-colors duration-500 ${
 isDone ? "bg-[#ee2b5b]/30" : "bg-slate-100 "
 }`}
 />
 )}
 </React.Fragment>
 );
 })}
 </div>
 );
}


