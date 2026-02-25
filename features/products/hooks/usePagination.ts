export const usePagination = (PRODUCTS: Product[], currentPage: number) => {
    
  // Cấu hình phân trang
  const itemsPerPage = 3;
  const totalPages = Math.ceil(PRODUCTS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = PRODUCTS.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Thêm trang đầu tiên nếu cần
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    // Thêm các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Thêm trang cuối cùng nếu cần
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return { paginatedProducts, getPageNumbers, totalPages };
};
