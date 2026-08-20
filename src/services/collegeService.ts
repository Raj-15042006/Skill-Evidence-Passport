import { supabase } from './supabaseClient';
import { IndianCollege, searchIndianColleges as fallbackSearch } from '../data/indianCollegesDataset';

export interface FetchedCollege {
  id: string;
  name: string;
  city: string;
  state: string;
  district?: string;
  category: string;
  tier: string;
  address_line1?: string;
  address_line2?: string;
  pin_code?: string;
}

/**
 * Fetch colleges dynamically from Supabase database (43,000+ colleges across India)
 * with graceful local fallback if offline.
 */
export async function fetchCollegesFromSupabase(
  query: string,
  limit: number = 30
): Promise<FetchedCollege[]> {
  const cleanQuery = (query || '').trim();

  // If query is empty, fetch top initial colleges
  if (!cleanQuery) {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .in('category', ['IIT', 'NIT', 'IIIT', 'Central Univ', 'State Univ'])
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data as FetchedCollege[];
      }
    } catch (e) {
      console.warn('Supabase initial fetch fallback:', e);
    }
    return fallbackSearch('', limit) as FetchedCollege[];
  }

  try {
    // 1. Attempt High-Performance PostgreSQL Trigram RPC Search
    const { data: rpcData, error: rpcError } = await supabase.rpc('search_indian_colleges', {
      search_term: cleanQuery,
      max_limit: limit,
    });

    if (!rpcError && rpcData && rpcData.length > 0) {
      return rpcData as FetchedCollege[];
    }

    // 2. Direct ILIKE table search fallback
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .or(`name.ilike.%${cleanQuery}%,city.ilike.%${cleanQuery}%,state.ilike.%${cleanQuery}%,district.ilike.%${cleanQuery}%`)
      .limit(limit);

    if (!error && data && data.length > 0) {
      return data as FetchedCollege[];
    }
  } catch (err) {
    console.warn('Supabase college search network error, using local fallback:', err);
  }

  // 3. Fallback to local curated dataset
  return fallbackSearch(cleanQuery, limit) as FetchedCollege[];
}
