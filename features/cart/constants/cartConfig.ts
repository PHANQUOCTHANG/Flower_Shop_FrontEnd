// Config cho trang cart
export const CART_CONFIG = {
  ROUTE: "/cart" as const,
  CHECKOUT_ROUTE: "/checkout" as const,
  PRODUCTS_ROUTE: "/products" as const,
  NAVIGATION_DELAY: 300,
  STEP_NAME: "cart" as const,
} as const;

// CSS Classes - màu sắc trang cart
export const CART_COLORS = {
  BACKGROUND: "#fcfbf9",
  TEXT: "#1b0d11",
  ACCENT: "#ee2b5b",
  ACCENT_HOVER: "#ee2b5b/80",
} as const;
