// Base form sections
export { default as RichEditor, type RichEditorRef } from "../RichEditor";
export { default as BasicInfoSection } from "./BasicInfoSection";
export { default as PricingSection } from "./PricingSection";
export { default as SkuSection } from "./SkuSection";
export { default as StatusSection } from "./StatusSection";
export { default as CategorySection, type Category } from "./CategorySection";
export { default as GallerySection, type ProductImage } from "./GallerySection";
export { default as ThumbnailSection } from "./ThumbnailSection";

// Wrapper components
export { ProductDetailHeader } from "./ProductDetailHeader";
export { ProductDetailFormContent } from "./ProductDetailFormContent";
export { ProductDetailSidebar } from "./ProductDetailSidebar";
export { ProductDetailFooter } from "./ProductDetailFooter";
export {
  ProductLoadingState,
  ProductErrorState,
} from "./ProductStateComponents";
