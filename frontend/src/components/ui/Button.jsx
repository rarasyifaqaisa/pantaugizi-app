export default function Button({
  children, onClick, variant = "primary",
  className = "", disabled = false, type = "button"
}) {
  const base = "w-full py-3 px-6 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-95";
  const variants = {
    primary:  "bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600",
    secondary:"bg-white text-green-600 border-2 border-green-500 hover:bg-green-50",
    ghost:    "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger:   "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}