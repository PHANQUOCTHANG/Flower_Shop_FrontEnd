import React from "react";
import { CheckCircle2, CreditCard } from "lucide-react";

interface ProgressTrackerProps {
 currentStep: "cart" | "checkout" | "completed";
}

// Thành phần hiển thị tiến độ 3 bước
export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
 currentStep,
}) => {
 const steps = [
 { id: "cart", label: "Giỏ hàng", icon: CheckCircle2 },
 { id: "checkout", label: "Thanh toán", icon: CreditCard },
 { id: "completed", label: "Hoàn tát", icon: CheckCircle2 },
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

 return (
 <div className="max-w-2xl mx-auto mb-12">
 <div className="flex justify-between items-center mb-6">
 {steps.map((step, index) => {
 const status = getStepStatus(step.id);
 const Icon = step.icon;
 const isCompleted = status === "completed";
 const isActive = status === "active";

 return (
 <React.Fragment key={step.id}>
 {/* Vòng tròn bước */}
 <div className="flex flex-col items-center gap-2">
 <div
 className={`size-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
 isCompleted
 ? "bg-green-500 text-white shadow-green-500/20"
 : isActive
 ? "bg-[#ee2b5b] text-white shadow-[#ee2b5b]/20 scale-110"
 : "bg-gray-200 text-gray-400"
 }`}
 >
 <Icon className="w-6 h-6" />
 </div>
 <span
 className={`typo-label-sm transition-colors duration-500 ${
 isCompleted
 ? "text-green-500"
 : isActive
 ? "text-[#ee2b5b] font-bold"
 : "text-gray-400"
 }`}
 >
 {step.label}
 </span>
 </div>

 {/* Đường nối bước */}
 {index < steps.length - 1 && (
 <div
 className={`h-1 grow mx-2 -mt-6 transition-all duration-500 ${
 getStepStatus(steps[index + 1].id) === "completed" ||
 getStepStatus(steps[index + 1].id) === "active"
 ? "bg-[#ee2b5b]"
 : "bg-gray-200 "
 }`}
 ></div>
 )}
 </React.Fragment>
 );
 })}
 </div>
 </div>
 );
};


