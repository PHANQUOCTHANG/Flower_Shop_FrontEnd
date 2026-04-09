// Product loading & error states components
import {
  PRODUCT_CONFIG,
  PRODUCT_MESSAGES,
} from "../../constants/productConfig";

interface ProductLoadingStateProps {
  message?: string;
}

interface ProductErrorStateProps {
  error?: string;
  onBack: () => void;
}

// Loading state
export function ProductLoadingState({
  message = PRODUCT_MESSAGES.LOADING_PRODUCT,
}: ProductLoadingStateProps) {
  return (
    <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#ee2b5b] rounded-full animate-spin" />
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  );
}

// Error state
export function ProductErrorState({
  error = PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
  onBack,
}: ProductErrorStateProps) {
  return (
    <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <svg
          className="w-12 h-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-slate-600">{error}</p>
        <button onClick={onBack} className="text-[#ee2b5b] hover:underline">
          {PRODUCT_MESSAGES.BACK}
        </button>
      </div>
    </div>
  );
}
