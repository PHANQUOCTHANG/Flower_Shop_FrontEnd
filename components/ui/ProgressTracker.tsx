import React from "react";
import { ShoppingCart, CreditCard, CheckCircle2 } from "lucide-react";

interface ProgressTrackerProps {
 currentStep: "cart" | "checkout" | "completed";
}

// Cấu hình màu sắc riêng cho từng bước
const STEP_COLORS = {
 cart: {
  active: "bg-[#ee2b5b] text-white shadow-[#13ec5b]/30",
  completed: "bg-[#13ec5b] text-white shadow-[#13ec5b]/20",
  text_active: "text-black",
  text_completed: "text-black",
  line: "bg-[#ee2b5b]",
 },
 checkout: {
  active: "bg-[#ee2b5b] text-white shadow-[#13ec5b]/30",
  completed: "bg-[#13ec5b] text-white shadow-[#13ec5b]/20",
  text_active: "text-black",
  text_completed: "text-black",
  line: "bg-[#ee2b5b]",
 },
 completed: {
  active: "bg-[#ee2b5b] text-white shadow-[#13ec5b]/30",
  completed: "bg-[#13ec5b] text-white shadow-[#13ec5b]/20",
  text_active: "text-black",
  text_completed: "text-black",
  line: "bg-[#ee2b5b]",
 },
};
// Thành phần hiển thị tiến độ 3 bước
export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
 currentStep,
}) => {
 const steps = [
  { id: "cart", label: "Giỏ hàng", icon: ShoppingCart },
  { id: "checkout", label: "Thanh toán", icon: CreditCard },
  { id: "completed", label: "Hoàn tất", icon: CheckCircle2 },
 ];

 // Xác định trạng thái của bước
 const getStepStatus = (stepId: string) => {
  const stepOrder = ["cart", "checkout", "completed"];
  const currentIndex = stepOrder.indexOf(currentStep);
  const stepIndex = stepOrder.indexOf(stepId);
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "active";
  return "inactive";
 };

 // Xác định màu đường nối giữa 2 bước
 const getLineColor = (fromStep: string, toStep: string) => {
  const toStatus = getStepStatus(toStep);
  if (toStatus === "completed") {
   return STEP_COLORS[toStep as keyof typeof STEP_COLORS].line;
  }
  if (toStatus === "active") {
   return STEP_COLORS[toStep as keyof typeof STEP_COLORS].line;
  }
  return "bg-gray-200";
 };

 return (
  <div className="max-w-2xl mx-auto mb-12">
   <div className="flex justify-between items-center mb-6">
    {steps.map((step, index) => {
     const status = getStepStatus(step.id);
     const Icon = step.icon;
     const isCompleted = status === "completed";
     const isActive = status === "active";
     const colors = STEP_COLORS[step.id as keyof typeof STEP_COLORS];

     return (
      <React.Fragment key={step.id}>
       {/* Vòng tròn bước */}
       <div className="flex flex-col items-center gap-2">
        <div
         className={`size-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
          isCompleted
           ? `${colors.completed} scale-100`
           : isActive
           ? `${colors.active} scale-110`
           : "bg-gray-200 text-gray-400"
         }`}
        >
         {isCompleted ? (
          <CheckCircle2 className="w-5 h-5" />
         ) : (
          <Icon className="w-5 h-5" />
         )}
        </div>
        <span
         className={`typo-label-sm transition-colors duration-500 ${
          isCompleted
           ? colors.text_completed
           : isActive
           ? `${colors.text_active} font-bold`
           : "text-gray-400"
         }`}
        >
         {step.label}
        </span>
       </div>

       {/* Đường nối bước */}
       {index < steps.length - 1 && (
        <div
         className={`h-1 grow mx-2 -mt-6 rounded-full transition-all duration-500 ${getLineColor(
          step.id,
          steps[index + 1].id
         )}`}
        ></div>
       )}
      </React.Fragment>
     );
    })}
   </div>
  </div>
 );
};
