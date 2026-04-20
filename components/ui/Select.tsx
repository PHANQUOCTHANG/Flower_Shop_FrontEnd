import React, { FC, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  id: string;
  name: string;
  code?: string;
}

export interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  isLoading?: boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  displayValue?: string; // Hiển thị khi các tùy chọn còn đang tải
}

export const Select: FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  isLoading = false,
  error,
  placeholder = "Chọn...",
  required = false,
  disabled = false,
  displayValue, // Fallback text khi options còn loading
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lọc options dựa trên search term
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Tìm selected option
  const selectedOption = options.find((opt) => opt.id === value);

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search khi đóng
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Label */}
      <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-2">
        {label} {required && <span className="text-[#ee2b5b]">*</span>}
      </label>

      {/* Dropdown trigger */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-between ${
            error
              ? "border-red-500 bg-red-50"
              : "border-slate-200 bg-white hover:border-slate-300 focus:border-[#ee2b5b]"
          } ${
            isOpen ? "border-[#ee2b5b]" : ""
          } text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span
            className={
              selectedOption || displayValue
                ? "text-slate-900"
                : "text-slate-400"
            }
          >
            {selectedOption?.name ||
              displayValue ||
              (isLoading ? "Đang tải..." : placeholder)}
          </span>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg z-20 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Search input */}
            {options.length > 5 && (
              <div className="p-2 border-b border-slate-100">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#ee2b5b]"
                  autoFocus
                />
              </div>
            )}

            {/* Options list */}
            <ul className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-3 text-center text-slate-500 text-sm">
                  Không tìm thấy kết quả
                </li>
              ) : (
                filteredOptions.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        value === option.id
                          ? "bg-[#ee2b5b]/10 text-[#ee2b5b] font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {option.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
