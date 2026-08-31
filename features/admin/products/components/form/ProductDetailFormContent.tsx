/* eslint-disable @typescript-eslint/no-explicit-any */
// Form content component - cột trái với tất cả sections
import {
  BasicInfoSection,
  PricingSection,
  SkuSection,
  GallerySection,
} from "./index";
// type ValidationErrors from formDataBuilder removed
import { UploadedImage } from "../../utils/formDataBuilder";

interface ProductDetailFormContentProps {
  basicInfoRef: React.RefObject<HTMLDivElement | null>;
  shortDescEditorRef: React.RefObject<any>;
  descEditorRef: React.RefObject<any>;
  name: string;
  onNameChange: (value: string) => void;

  price: string;
  onPriceChange: (value: string) => void;
  comparePrice: string;
  onComparePriceChange: (value: string) => void;
  sku: string;
  onSkuChange: (value: string) => void;
  images: UploadedImage[];
  onFilesAdd: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  onReorderImages: (fromIndex: number, toIndex: number) => void;
  onSetPrimaryImage: (index: number) => void;
  isDragging: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  errors?: any;
}

// Cột trái: Tất cả form sections
export function ProductDetailFormContent({
  basicInfoRef,
  shortDescEditorRef,
  descEditorRef,
  name,
  onNameChange,

  price,
  onPriceChange,
  comparePrice,
  onComparePriceChange,
  sku,
  onSkuChange,
  images,
  onFilesAdd,
  onImageRemove,
  onReorderImages,
  onSetPrimaryImage,
  isDragging,
  onDragEnter,
  onDragLeave,
  errors,
}: ProductDetailFormContentProps) {
  return (
    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
      {/* Thông tin cơ bản */}
      <BasicInfoSection
        ref={basicInfoRef}
        name={name}
        onNameChange={onNameChange}
        shortDescRef={shortDescEditorRef}
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
          id: img.id,
          url: img.url,
        }))}
        onFilesAdd={onFilesAdd}
        onImageRemove={onImageRemove}
        onReorder={onReorderImages}
        onSetPrimary={onSetPrimaryImage}
        isDragging={isDragging}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      />
    </div>
  );
}
