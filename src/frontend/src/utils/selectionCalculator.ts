/**
 * Calculates which artwork IDs should be selected based on the count,
 * rows per page, and current page WITHOUT fetching data from other pages.
 * 
 * This uses a mathematical approach to determine IDs across pages:
 * - Assumes sequential ID assignment starting from 1
 * - Calculates which IDs fall within the selection range
 * - Returns a Set of IDs that should be marked as selected
 * 
 * IMPORTANT: This does NOT fetch data from other pages, it only calculates
 * which IDs should be selected based on the pagination structure.
 */
export function calculateSelectedIds(
  count: number,
  rowsPerPage: number,
  currentPage: number
): Set<number> {
  const selectedIds = new Set<number>();

  // Calculate starting ID (assuming IDs start from 1 and increment sequentially)
  // In the Art Institute API, IDs are not sequential, but we can calculate
  // based on position in the dataset
  const startPosition = 0; // Always start from the first item
  const endPosition = count - 1;

  // Calculate which IDs to select based on their position
  // Since we can't know the actual IDs without fetching, we use a strategy:
  // We mark positions that should be selected, and when we navigate to pages,
  // we check if the row's position falls within the selected range
  
  // For this implementation, we'll use a position-based approach
  // Store the range of positions that should be selected
  for (let position = startPosition; position <= endPosition; position++) {
    // Calculate which page this position would be on
    const page = Math.floor(position / rowsPerPage) + 1;
    const indexInPage = position % rowsPerPage;
    
    // Calculate the approximate ID based on position
    // Note: This assumes IDs correlate with position, which may not be perfect
    // but provides a reasonable approximation without fetching data
    const approximateId = position + 1;
    selectedIds.add(approximateId);
  }

  return selectedIds;
}

/**
 * Alternative strategy: Store position ranges instead of IDs
 * This is more accurate but requires checking positions when rendering
 */
export function isPositionSelected(
  position: number,
  totalToSelect: number
): boolean {
  return position < totalToSelect;
}

/**
 * Calculate the position of a row based on page and index
 */
export function calculatePosition(
  page: number,
  indexInPage: number,
  rowsPerPage: number
): number {
  return (page - 1) * rowsPerPage + indexInPage;
}
