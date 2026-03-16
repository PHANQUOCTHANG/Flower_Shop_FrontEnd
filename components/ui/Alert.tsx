import { AlertCircle, CheckCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export type AlertType = "success" | "error";

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Alert({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === "success";
  const bgColor = isSuccess
    ? "bg-green-50 dark:bg-green-950/30"
    : "bg-red-50 dark:bg-red-950/30";
  const borderColor = isSuccess
    ? "border-green-200 dark:border-green-800"
    : "border-red-200 dark:border-red-800";
  const textColor = isSuccess
    ? "text-green-800 dark:text-green-200"
    : "text-red-800 dark:text-red-200";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";

  const Icon = isSuccess ? CheckCircle : AlertCircle;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border
        ${bgColor} ${borderColor} ${textColor}
        animate-in fade-in slide-in-from-top-2 duration-300
      `}
      role="alert"
    >
      <Icon size={20} className={`flex-shrink-0 mt-0.5 ${iconColor}`} />

      <div className="flex-1">
        <p className="text-sm font-semibold">{message}</p>
      </div>

      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className={`
          flex-shrink-0 text-lg hover:opacity-70 transition-opacity
          ${isSuccess ? "hover:text-green-600" : "hover:text-red-600"}
        `}
        aria-label="Close alert"
      >
        <X size={20} />
      </button>
    </div>
  );
}
