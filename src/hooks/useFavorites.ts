import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Favorite } from '../types';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setFavorites(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback(
    (itemType: string, itemId: string) =>
      favorites.some((f) => f.item_type === itemType && f.item_id === itemId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (itemType: Favorite['item_type'], itemId: string) => {
      if (!user) return;

      const existing = favorites.find(
        (f) => f.item_type === itemType && f.item_id === itemId
      );

      if (existing) {
        await supabase.from('favorites').delete().eq('id', existing.id);
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      } else {
        const { data } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, item_type: itemType, item_id: itemId })
          .select()
          .maybeSingle();
        if (data) setFavorites((prev) => [data, ...prev]);
      }
    },
    [user, favorites]
  );

  return { favorites, loading, isFavorite, toggleFavorite, refetch: fetchFavorites };
}
