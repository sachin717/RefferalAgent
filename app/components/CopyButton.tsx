"use client";

export default function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text)}
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Copy
    </button>
  );
}