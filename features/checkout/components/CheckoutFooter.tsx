// Footer cho trang checkout
export function CheckoutFooter() {
  return (
    <footer className="mt-16 py-12 border-t border-gray-100 text-center px-4 bg-white">
      <p className="typo-caption-xs text-gray-400">
        © 2024 Flower Shop • Trao gửi yêu thương trên từng đóa hoa
      </p>

      {/* Thanh toán hỗ trợ */}
      <div className="flex justify-center gap-4 mt-4 grayscale opacity-30">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
          className="h-4"
          alt="PayPal"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
          className="h-4"
          alt="Visa"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
          className="h-4"
          alt="Mastercard"
        />
      </div>
    </footer>
  );
}
