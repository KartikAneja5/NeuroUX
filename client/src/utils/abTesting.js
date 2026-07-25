// Simple A/B Testing Harness (Phase 5)
// Variant A: Standard Default Homepage Order
// Variant B: Layer-1 Affinity Adaptive Homepage Order

export function getOrAssignABVariant() {
  let variant = localStorage.getItem('neuroux_ab_variant');
  if (!variant) {
    // 50% random split
    variant = Math.random() < 0.5 ? 'variant_A' : 'variant_B';
    localStorage.setItem('neuroux_ab_variant', variant);
  }
  return variant;
}

export function getABVariantName() {
  const variant = getOrAssignABVariant();
  return variant === 'variant_B' ? 'Variant B (Adaptive AI)' : 'Variant A (Standard)';
}
