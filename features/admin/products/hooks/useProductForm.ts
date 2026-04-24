import { useState, useRef, useEffect, useTransition } from "react";
import { type Category, type RichEditorRef } from "@/features/admin/products/components/form";
import { useCategories, useCreateCategory } from "@/features/admin/products/hooks/useCategories";
import { type AlertType } from "@/components/ui/Alert";

export interface AlertState {
  type: AlertType;
  message: string;
}

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  file?: File;
}

export interface ThumbnailState {
  url: string;
  name: string;
  file?: File;
}

export function useProductForm() {
  // ===== HOOKS =====
  // Hook xử lý kết nối API với danh mục sản phẩm (categories)
  const { createCategoryAsync: createCategoryHook } = useCreateCategory();
  const { categories: fetchedCategories, loading: loadingCategories } = useCategories();
  const [, startTransition] = useTransition();

  // ===== REF: SECTION REFS =====
  // Các UseRef dùng để tham chiếu tới giao diện hoặc trình soạn thảo văn bản
  const basicInfoRef = useRef<HTMLDivElement>(null);
  const descEditorRef = useRef<RichEditorRef>(null);

  // ===== STATE: ALERT & UI =====
  // State quản lý hiển thị thông báo trạng thái (thành công/lỗi)
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  // ===== STATE: BASIC INFO =====
  // Các state lưu trữ những thông tin cơ bản của sản phẩm
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [status, setStatus] = useState<"active" | "hidden" | "draft">("active");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [sku, setSku] = useState("");

  // ===== STATE: CATEGORY =====
  // State chứa toàn bộ danh sách danh mục và các danh mục đang được người dùng tick chọn
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // ===== STATE: IMAGES =====
  // State quản lý danh sách ảnh thư viện (gallery) và các ID ảnh cũ bị xóa
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false); // Quản lý trạng thái kéo thả ảnh
  
  // State quản lý thông tin của ảnh đại diện (thumbnail)
  const [thumbnail, setThumbnail] = useState<ThumbnailState | null>(null);
  const [isThumbDragging, setIsThumbDragging] = useState(false); // Quản lý kéo thả của ảnh đại diện

  // ===== EFFECTS =====
  // Tự động map dữ liệu danh sách category nhận được từ API vào state
  useEffect(() => {
    if (fetchedCategories.length > 0) {
      startTransition(() => {
        const categoryList: Category[] = fetchedCategories.map((cat: any) => ({
          id: String(cat.id),
          name: cat.name,
          slug: cat.slug || "",
        }));
        setCategories(categoryList);
      });
    }
  }, [fetchedCategories]);

  // ===== HELPER FUNCTIONS =====
  // Xử lý khi người dùng chọn file hoặc kéo thả nhiều file vào thư viện ảnh
  const addFiles = (files: File[]) => {
    const newImgs: UploadedImage[] = files
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(f),
        name: f.name,
        file: f,
      }));
    setImages((prev) => [...prev, ...newImgs]);
  };

  // Xử lý xóa ảnh trong thư viện ảnh bằng index
  const handleRemoveImage = (index: number) => {
    const imgToRemove = images[index];

    // Chỉ theo dõi ảnh đã xóa nếu ảnh đó được load từ Database API (có ID và không có thuộc tính file lưu mới)
    if (imgToRemove && imgToRemove.id && !imgToRemove.file) {
      setDeletedImageIds((prevDeleted) => [...prevDeleted, imgToRemove.id]);
    }

    setImages((prev) => {
      const img = prev[index];
      if (img && img.url.startsWith("blob:")) URL.revokeObjectURL(img.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Xử lý khi người dùng chọn hoặc kéo thả file làm ảnh đại diện
  const handleThumbFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (thumbnail?.url && thumbnail.url.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnail.url);
    }
    setThumbnail({
      url: URL.createObjectURL(file),
      name: file.name,
      file: file,
    });
  };

  // Loại bỏ ảnh đại diện khỏi form (kèm dọn dẹp bộ nhớ Blob URL)
  const handleRemoveThumbnail = () => {
    if (thumbnail?.url && thumbnail.url.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnail.url);
    }
    setThumbnail(null);
  };

  // Gửi API để tạo 1 danh mục mới và ngay lập tức thêm vào mảng categories đang được nhắm tới
  const handleAddCategory = async (categoryName: string, thumbFile: File | null = null) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;

    try {
      let payload: any = { name: trimmed };
      if (thumbFile) {
        payload = new FormData();
        payload.append("name", trimmed);
        payload.append("thumbnail", thumbFile);
      }
      const newCategory = await createCategoryHook(payload);
      const categoryId = String(newCategory.id);
      
      startTransition(() => {
        setCategories((prev) => [
          ...prev,
          { 
            id: categoryId, 
            name: newCategory.name,
            slug: newCategory.slug || ""
          },
        ]);
        setSelectedCategoryIds((prev) => [...prev, categoryId]);
      });
    } catch (error) {
      console.error("❌ Lỗi tạo category:", error);
      setAlertState({
        type: "error",
        message: "Không thể tạo category. Vui lòng thử lại.",
      });
    }
  };

  // Logic bật/tắt (toggle) chọn 1 danh mục trong danh sách
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  // Trả form về trạng thái trống ban đầu
  const resetForm = () => {
    setName("");
    setShortDescription("");
    setStatus("active");
    setPrice("");
    setComparePrice("");
    setSku("");
    setImages([]);
    setThumbnail(null);
    setSelectedCategoryIds([]);
    descEditorRef.current?.setHTML("");
  };

  // Xác thực và chuẩn hoá dữ liệu dựa trên backend request (product.request.ts)
  const validateForm = (): string | null => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return "Tên sản phẩm phải có tối thiểu 2 ký tự.";
    if (trimmedName.length > 255) return "Tên sản phẩm tối đa 255 ký tự.";

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) return "Giá sản phẩm phải là số hợp lệ và không được âm.";

    if (comparePrice) {
      const parsedCompare = parseFloat(comparePrice);
      if (isNaN(parsedCompare) || parsedCompare < 0) return "Giá so sánh phải là số hợp lệ và không được âm.";
    }

    const trimmedSku = sku.trim();
    if (trimmedSku.length > 100) return "Mã SKU tối đa 100 ký tự.";

    if (shortDescription.trim().length > 500) return "Mô tả ngắn tối đa 500 ký tự.";

    return null; // Trả về null nếu mọi dữ liệu đều hợp lệ
  };

  // Hàm điền dữ liệu sản phẩm có sẵn vào form (dành cho trang Cập nhật)
  const populateForm = (product: any) => {
    setName(product.name || "");
    setStatus((product.status || "active") as any);
    setPrice(String(product.price ?? ""));
    setComparePrice(String(product.comparePrice ?? ""));
    setSku(product.sku || "");

    if (product.categories) {
      const categoryIds = product.categories.map((cat: any) => String(cat.id));
      setSelectedCategoryIds(categoryIds);
    }

    if (product.thumbnailUrl) {
      setThumbnail({
        url: product.thumbnailUrl,
        name: "Current thumbnail",
      });
    }

    if (product.images && Array.isArray(product.images)) {
      const imgList: UploadedImage[] = product.images.map((img: any, idx: number) => ({
        id: img.id,
        url: img.url,
        name: `Image ${idx + 1}`,
      }));
      setImages(imgList);
      setDeletedImageIds([]);
    }

    setShortDescription(product.shortDescription || "");

    if (product.description) {
      descEditorRef.current?.setHTML(product.description);
    }
  };

  return {
    refs: {
      basicInfoRef,
      descEditorRef,
    },
    state: {
      alertState,
      name,
      shortDescription,
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
    },
    actions: {
      setAlertState,
      setName,
      setShortDescription,
      setStatus,
      setPrice,
      setComparePrice,
      setSku,
      setSelectedCategoryIds,
      setImages,
      setDeletedImageIds,
      setIsDragging,
      setThumbnail,
      setIsThumbDragging,
      addFiles,
      handleRemoveImage,
      handleThumbFile,
      handleRemoveThumbnail,
      handleAddCategory,
      handleSelectCategory,
      resetForm,
      validateForm,
      populateForm,
    }
  };
}
