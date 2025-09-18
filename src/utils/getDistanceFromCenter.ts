export default function getDistanceFromCenter(
  entry: IntersectionObserverEntry
) {
  const viewportCenter = window.innerHeight / 2;
  const rect = entry.boundingClientRect;
  const elementCenter = rect.top + rect.height / 2;
  return Math.abs(viewportCenter - elementCenter);
}
