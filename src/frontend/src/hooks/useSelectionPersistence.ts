import { useState, useCallback } from 'react';
import { calculateSelectedIds } from '../utils/selectionCalculator';

export function useSelectionPersistence(rowsPerPage: number) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const isSelected = useCallback(
    (id: number) => {
      return selectedIds.has(id);
    },
    [selectedIds]
  );

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAllOnPage = useCallback((pageIds: number[]) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      const allSelected = pageIds.every((id) => newSet.has(id));

      if (allSelected) {
        // Deselect all on this page
        pageIds.forEach((id) => newSet.delete(id));
      } else {
        // Select all on this page
        pageIds.forEach((id) => newSet.add(id));
      }

      return newSet;
    });
  }, []);

  const areAllSelectedOnPage = useCallback(
    (pageIds: number[]) => {
      return pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
    },
    [selectedIds]
  );

  const getSelectedCount = useCallback(() => {
    return selectedIds.size;
  }, [selectedIds]);

  const handleCustomSelection = useCallback(
    (count: number, currentPage: number) => {
      const calculatedIds = calculateSelectedIds(count, rowsPerPage, currentPage);
      setSelectedIds(calculatedIds);
    },
    [rowsPerPage]
  );

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    isSelected,
    toggleSelection,
    toggleAllOnPage,
    areAllSelectedOnPage,
    getSelectedCount,
    handleCustomSelection,
    clearSelection,
  };
}
