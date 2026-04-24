"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Alert from "@/components/ui/Alert";
import { DeleteConfirmDialog } from "@/components/ui/admin/DeleteConfirmDialog";

// Hooks & utilities
import {
  useProductBySlug,
  useUpdateProduct,
  useDeleteProduct,
} from "@/features/admin/products/hooks/useProducts";
import { useProductForm } from "@/features/admin/products/hooks/useProductForm";
import {
  buildFormData,
  logFormData,
} from "@/features/admin/products/utils/formSubmission";

// Components
import {
  ProductDetailHeader,
  ProductDetailFormContent,
  ProductDetailSidebar,
  ProductDetailFooter,
  ProductLoadingState,
  ProductErrorState,
} from "@/features/admin/products/components/form";

// Constants
import {
  PRODUCT_CONFIG,
  PRODUCT_MESSAGES,
  PRODUCT_COLORS,
} from "@/features/admin/products/constants/productConfig";

// Trang chỉnh sửa sản phẩm

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug as string;
  const [, startTransition] = useTransition();

  // Lấy dữ liệu sản phẩm từ API
  const {
    product,
    loading: loadingProduct,
    error: productError,
  } = useProductBySlug(slug);
  const {
    updateProductAsync: updateProductHook,
    isPending: isProductUpdating,
  } = useUpdateProduct();
  const {
    deleteProductAsync: deleteProductHook,
    isPending: isDeletingProduct,
  } = useDeleteProduct();

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
    deletedImageIds,
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
    setDeletedImageIds,
    setThumbnail,
    setSelectedCategoryIds,
    addFiles,
    handleRemoveImage,
    handleThumbFile,
    handleRemoveThumbnail,
    handleAddCategory,
    handleSelectCategory,
    setIsDragging,
    setIsThumbDragging,
    validateForm,
    populateForm,
  } = actions;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Populate form khi sản phẩm tải xong
  useEffect(() => {
    if (product) {
      startTransition(() => {
        populateForm(product);
      });
    }
  }, [product]);

  // Xử lý submit form - validate & cập nhật sản phẩm
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProductUpdating || !product) return;

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

        // Xử lý thumbnail - upload file hoặc xóa nếu có file mới/cũ
        if (thumbnail?.file) {
          formDataToSend.append("thumbnail", thumbnail.file);
        } else if (!thumbnail && product?.thumbnailUrl) {
          // Thumbnail bị xóa (không có file mới, nhưng có file cũ)
          formDataToSend.append("thumbnailEmpty", "true");
        }

        // Thêm gallery images
        images.forEach((img) => {
          if (img.file) {
            formDataToSend.append("images", img.file);
          }
        });

        // Thêm deleted image IDs
        if (deletedImageIds.length > 0) {
          deletedImageIds.forEach((id) => {
            formDataToSend.append("deletedImageIds", id);
          });
        }

        // Log dữ liệu cho debugging
        console.log("📦 Dữ liệu cập nhật sản phẩm:");
        logFormData(formDataToSend as any);

        // Gọi API update
        await updateProductHook({
          productId: product.id,
          data: formDataToSend as any,
          slug: slug,
        });

        setAlertState({
          type: "success",
          message: PRODUCT_MESSAGES.UPDATE_SUCCESS,
        });

        // Reset deleted images sau khi update thành công
        setDeletedImageIds([]);
        setTimeout(
          () => router.push(PRODUCT_CONFIG.PRODUCTS_LIST_ROUTE),
          PRODUCT_CONFIG.REDIRECT_DELAY,
        );
      } catch (error) {
        console.error("❌ Lỗi cập nhật sản phẩm:", error);
        setAlertState({
          type: "error",
          message: PRODUCT_MESSAGES.UPDATE_ERROR,
        });
      }
    });
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async () => {
    if (!product) return;

    try {
      await deleteProductHook(product.id);
      setAlertState({
        type: "success",
        message: PRODUCT_MESSAGES.DELETE_SUCCESS,
      });
      setTimeout(
        () => router.push(PRODUCT_CONFIG.PRODUCTS_LIST_ROUTE),
        PRODUCT_CONFIG.REDIRECT_DELAY,
      );
    } catch (error) {
      console.error("❌ Lỗi xóa sản phẩm:", error);
      setAlertState({
        type: "error",
        message: PRODUCT_MESSAGES.DELETE_ERROR,
      });
      setShowDeleteConfirm(false);
    }
  };

  // Trạng thái loading hoặc lỗi

  if (loadingProduct) {
    return <ProductLoadingState />;
  }

  if (productError || !product) {
    return (
      <ProductErrorState
        error={
          productError
            ? PRODUCT_MESSAGES.LOADING_ERROR
            : PRODUCT_MESSAGES.PRODUCT_NOT_FOUND
        }
        onBack={() => router.back()}
      />
    );
  }

  return (
    <div
      className="min-h-screen font-sans text-slate-900 overflow-y-auto"
      style={{ backgroundColor: PRODUCT_CONFIG.BACKGROUND_COLOR }}
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

      {/* Delete confirm dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        title={PRODUCT_MESSAGES.DELETE_CONFIRM_TITLE}
        message={PRODUCT_MESSAGES.DELETE_CONFIRM_MESSAGE}
        onConfirm={handleDeleteProduct}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeletingProduct}
      />

      {/* Header */}
      <ProductDetailHeader isEdit={true} />

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

          {/* Cột phải: Settings & actions */}
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
            onDeleteProduct={() => setShowDeleteConfirm(true)}
            isDeletingProduct={isDeletingProduct}
          />
        </form>
      </div>

      {/* Bottom action bar */}
      <ProductDetailFooter
        isUpdating={isProductUpdating}
        onCancel={() => router.back()}
        onSubmit={() =>
          document
            .getElementById("product-form")
            ?.dispatchEvent(new Event("submit", { bubbles: true }))
        }
        submitLabel={PRODUCT_MESSAGES.UPDATE_PRODUCT}
      />
    </div>
  );
}
