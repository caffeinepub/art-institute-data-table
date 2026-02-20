import { useState, useEffect } from 'react';
import type { Artwork, ArtworkApiResponse } from '../types/artwork';

export function useArtworkData(page: number) {
  const [data, setData] = useState<Artwork[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${page}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ArtworkApiResponse = await response.json();
        setData(result.data);
        setTotalRecords(result.pagination.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch artworks');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [page]);

  return { data, loading, error, totalRecords };
}
