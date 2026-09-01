// Footer component - bottom action bar
import {
  PRODUCT_COLORS,
  PRODUCT_MESSAGES,
  PRODUCT_FORM_LABELS,
} from "../../constants/productConfig";

interface ProductDetailFooterProps {
  isUpdating: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isDraft?: boolean;
  submitLabel?: string;
}

// Bottom action bar với Cancel & Submit buttons
export function ProductDetailFooter({
  isUpdating,
  onCancel,
  onSubmit,
  isDraft = false,
  submitLabel = PRODUCT_MESSAGES.UPDATE_PRODUCT,
}: ProductDetailFooterProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between z-20">
      {/* Status indicator */}
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
        {PRODUCT_MESSAGES.UNSAVED}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {PRODUCT_FORM_LABELS.CANCEL}
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={isUpdating}
          className="bg-primary text-white px-8 py-2 text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isUpdating ? `${submitLabel.split(" ")[0]}...` : submitLabel}
        </button>
      </div>
    </div>
  );
}
