"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="ugnay-btn ugnay-btn-outline w-full sm:w-auto"
    >
      Print / save one-page summary
    </button>
  );
}
