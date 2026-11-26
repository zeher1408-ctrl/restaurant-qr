// Spice level labels used across UI
export const SPICE_LABELS = ["Mild", "Medium", "Hot", "Extra Hot"] as const;

export function formatPrice(rupees: number) {
  return `Rs ${rupees.toLocaleString("en-PK")}`;
}
