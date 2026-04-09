"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/components/ui/Alert";

// Hooks & utilities
import { useCreateProduct } from "@/features/admin/products/hooks/useProducts";
import { useProductForm } from "@/features/admin/products/hooks/useProductForm";
import { logFormData } from "@/features/admin/products/utils/formSubmission";

// Components
import {
  ProductDetailHeader,
  ProductDetailFormContent,
  ProductDetailSidebar,
  ProductDetailFooter,
} from "@/features/admin/products/components/form";

// Constants
import {
  PRODUCT_CONFIG,
  PRODUCT_MESSAGES,
} from "@/features/admin/products/constants/productConfig";

// Trang tạo sản phẩm mới

export default function AddNewProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Lấy hàm tạo sản phẩm
  const {
    createProductAsync: createProductHook,
    isPending: isProductCreating,
  } = useCreateProduct();

  // Hooks cho form management
  const { refs, state, actions } = useProductForm();

  // Destructure refs
  const { basicInfoRef, descEditorRef } = refs;

  // Destructure state
  const {
    alertState,
    name,
    status,
    price,
    comparePrice,
    sku,
    categories,
    selectedCategoryIds,
    images,
    isDragging,
    thumbnail,
    isThumbDragging,
    loadingCategories,
  } = state;

  // Destructure actions
  const {
    setAlertState,
    setName,
    setStatus,
    setPrice,
    setComparePrice,
    setSku,
    addFiles,
    handleRemoveImage,
    handleThumbFile,
    handleRemoveThumbnail,
    handleAddCategory,
    handleSelectCategory,
    setIsDragging,
    setIsThumbDragging,
    resetForm,
    validateForm,
  } = actions;

  // Xử lý submit form - validate & tạo sản phẩm
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProductCreating) return;

    // Validate form
    const errorMsg = validateForm();
    if (errorMsg) {
      setAlertState({ type: "error", message: errorMsg });
      return;
    }

    startTransition(async () => {
      try {
        // Lấy HTML content từ rich editor
        const desc = descEditorRef.current?.getHTML() ?? "";

        // Tạo FormData chứa files thực tế
        const formDataToSend = new FormData();

        // Thêm text fields
        formDataToSend.append("name", name.trim());
        if (state.shortDescription.trim())
          formDataToSend.append(
            "shortDescription",
            state.shortDescription.trim(),
          );
        if (desc.trim()) formDataToSend.append("description", desc.trim());
        formDataToSend.append("price", String(parseFloat(price) || 0));
        if (comparePrice)
          formDataToSend.append(
            "comparePrice",
            String(parseFloat(comparePrice)),
          );
        if (sku.trim()) formDataToSend.append("sku", sku.trim());
        formDataToSend.append("status", status);

        // Thêm categories
        selectedCategoryIds.forEach((id) => {
          formDataToSend.append("categoryIds", id);
        });

        // Thêm thumbnail file
        if (thumbnail?.file) {
          formDataToSend.append("thumbnail", thumbnail.file);
        }

        // Thêm gallery images
        images.forEach((img) => {
          if (img.file) {
            formDataToSend.append("images", img.file);
          }
        });

        // Log dữ liệu cho debugging
        console.log("📦 Dữ liệu tạo sản phẩm mới:");
        logFormData(formDataToSend as any);

        // Gọi API tạo
        await createProductHook(formDataToSend as any);

        setAlertState({
          type: "success",
          message: PRODUCT_MESSAGES.CREATE_SUCCESS,
        });

        // Reset form
        resetForm();
        setTimeout(
          () => router.push(PRODUCT_CONFIG.PRODUCTS_LIST_ROUTE),
          PRODUCT_CONFIG.REDIRECT_DELAY,
        );
      } catch (error) {
        console.error("❌ Lỗi tạo sản phẩm:", error);
        setAlertState({
          type: "error",
          message: PRODUCT_MESSAGES.CREATE_ERROR,
        });
      }
    });
  };

  return (
    <div
      className="min-h-screen font-sans text-slate-900 overflow-y-auto"
      style={{ backgroundColor: PRODUCT_CONFIG.BACKGROUND }}
    >
      {/* Alert */}
      {alertState && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            type={alertState.type}
            message={alertState.message}
            onClose={() => setAlertState(null)}
            autoClose={true}
            duration={PRODUCT_CONFIG.ALERT_DURATION}
          />
        </div>
      )}

      {/* Header */}
      <ProductDetailHeader isEdit={false} />

      {/* Form container */}
      <div className="px-8 py-8 pb-28">
        <form
          id="product-form"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          onSubmit={handleSubmit}
        >
          {/* Cột trái: Form sections */}
          <ProductDetailFormContent
            basicInfoRef={basicInfoRef}
            descEditorRef={descEditorRef}
            name={name}
            onNameChange={setName}
            shortDesc={state.shortDescription}
            onShortDescChange={actions.setShortDescription}
            price={price}
            onPriceChange={setPrice}
            comparePrice={comparePrice}
            onComparePriceChange={setComparePrice}
            sku={sku}
            onSkuChange={setSku}
            images={images}
            onFilesAdd={addFiles}
            onImageRemove={handleRemoveImage}
            isDragging={isDragging}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
          />

          {/* Cột phải: Settings (không hiển thị delete button) */}
          <ProductDetailSidebar
            status={status}
            onStatusChange={setStatus}
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onSelectCategory={handleSelectCategory}
            onAddCategory={handleAddCategory}
            isLoadingCategories={loadingCategories}
            thumbnail={thumbnail}
            onThumbFile={handleThumbFile}
            onRemoveThumbnail={handleRemoveThumbnail}
            isThumbDragging={isThumbDragging}
            onThumbDragEnter={() => setIsThumbDragging(true)}
            onThumbDragLeave={() => setIsThumbDragging(false)}
          />
        </form>
      </div>

      {/* Bottom action bar */}
      <ProductDetailFooter
        isUpdating={isProductCreating || isPending}
        onCancel={() => router.back()}
        onSubmit={() =>
          document
            .getElementById("product-form")
            ?.dispatchEvent(new Event("submit", { bubbles: true }))
        }
        submitLabel={PRODUCT_MESSAGES.PUBLISH_PRODUCT}
      />
    </div>
  );
}
