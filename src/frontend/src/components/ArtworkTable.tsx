import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useArtworkData } from '../hooks/useArtworkData';
import { useSelectionPersistence } from '../hooks/useSelectionPersistence';
import { CustomSelectionPanel } from './CustomSelectionPanel';
import type { Artwork } from '../types/artwork';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ArtworkTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const { data: artworks, loading, error, totalRecords } = useArtworkData(currentPage);
  const {
    isSelected,
    toggleSelection,
    toggleAllOnPage,
    areAllSelectedOnPage,
    getSelectedCount,
    handleCustomSelection,
  } = useSelectionPersistence(rowsPerPage);

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value, 10));
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (artworks) {
      toggleAllOnPage(artworks.map((a) => a.id));
    }
  };

  const handleCustomSelectionSubmit = (count: number) => {
    handleCustomSelection(count, currentPage);
  };

  const allSelectedOnPage = artworks ? areAllSelectedOnPage(artworks.map((a) => a.id)) : false;
  const someSelectedOnPage = artworks ? artworks.some((a) => isSelected(a.id)) : false;

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">Error loading artworks</p>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CustomSelectionPanel onSubmit={handleCustomSelectionSubmit} />
          <div className="text-sm text-muted-foreground">
            {getSelectedCount()} row(s) selected across all pages
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelectedOnPage}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all on page"
                    className={someSelectedOnPage && !allSelectedOnPage ? 'data-[state=checked]:bg-primary' : ''}
                  />
                </TableHead>
                <TableHead className="min-w-[250px]">Title</TableHead>
                <TableHead className="min-w-[150px]">Place of Origin</TableHead>
                <TableHead className="min-w-[200px]">Artist</TableHead>
                <TableHead className="min-w-[200px]">Inscriptions</TableHead>
                <TableHead className="min-w-[120px] text-center">Date Start</TableHead>
                <TableHead className="min-w-[120px] text-center">Date End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : artworks && artworks.length > 0 ? (
                artworks.map((artwork) => (
                  <TableRow
                    key={artwork.id}
                    className={isSelected(artwork.id) ? 'bg-primary/10' : ''}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected(artwork.id)}
                        onCheckedChange={() => toggleSelection(artwork.id)}
                        aria-label={`Select ${artwork.title || 'artwork'}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {artwork.title || 'Untitled'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {artwork.place_of_origin || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {artwork.artist_display || 'Unknown Artist'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="truncate max-w-xs">
                        {artwork.inscriptions || 'None'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {artwork.date_start || '—'}
                    </TableCell>
                    <TableCell className="text-center">
                      {artwork.date_end || '—'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center text-muted-foreground">
                    No artworks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page:</span>
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {((currentPage - 1) * rowsPerPage) + 1} to{' '}
              {Math.min(currentPage * rowsPerPage, totalRecords)} of {totalRecords} artworks
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || loading}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className="h-8 w-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || loading}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
