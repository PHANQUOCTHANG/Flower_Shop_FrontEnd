/* eslint-disable @typescript-eslint/no-explicit-any */
// Form content component - cột trái với tất cả sections
import {
  BasicInfoSection,
  PricingSection,
  SkuSection,
  GallerySection,
} from "./index";
import type { ValidationErrors } from "../../utils/formDataBuilder";
import { UploadedImage } from "../../utils/formDataBuilder";

interface ProductDetailFormContentProps {
  basicInfoRef: React.RefObject<HTMLInputElement>;
  descEditorRef: React.RefObject<any>;
  name: string;
  onNameChange: (value: string) => void;
  shortDesc: string;
  onShortDescChange: (value: string) => void;
  price: string;
  onPriceChange: (value: string) => void;
  comparePrice: string;
  onComparePriceChange: (value: string) => void;
  sku: string;
  onSkuChange: (value: string) => void;
  images: UploadedImage[];
  onFilesAdd: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  isDragging: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  errors?: ValidationErrors;
}

// Cột trái: Tất cả form sections
export function ProductDetailFormContent({
  basicInfoRef,
  descEditorRef,
  name,
  onNameChange,
  shortDesc,
  onShortDescChange,
  price,
  onPriceChange,
  comparePrice,
  onComparePriceChange,
  sku,
  onSkuChange,
  images,
  onFilesAdd,
  onImageRemove,
  isDragging,
  onDragEnter,
  onDragLeave,
  errors,
}: ProductDetailFormContentProps) {
  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Thông tin cơ bản */}
      <BasicInfoSection
        ref={basicInfoRef}
        name={name}
        onNameChange={onNameChange}
        shortDesc={shortDesc}
        onShortDescChange={onShortDescChange}
        descRef={descEditorRef}
      />

      {/* Giá bán */}
      <PricingSection
        price={price}
        comparePrice={comparePrice}
        onPriceChange={onPriceChange}
        onComparePriceChange={onComparePriceChange}
      />

      {/* SKU */}
      <SkuSection sku={sku} onSkuChange={onSkuChange} />

      {/* Thư viện ảnh */}
      <GallerySection
        images={images.map((img) => ({
          url: img.url,
        }))}
        onFilesAdd={onFilesAdd}
        onImageRemove={onImageRemove}
        isDragging={isDragging}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      />
    </div>
  );
}
