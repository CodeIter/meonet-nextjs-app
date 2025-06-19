
import { type SupabaseClient } from '@supabase/supabase-js';

import { SupabaseRepository } from '@/lib/storage/SupabaseRepository'

export interface URLShortenerItem {
  short_code: string;
  original_url: string;
  ip: string;
  created_at: string;
}

export class URLShortenerRepository extends SupabaseRepository<URLShortenerItem, 'short_code'> {

  constructor(supabase: SupabaseClient) {
    super(supabase, 'urlshortener', 'short_code');
  }

  /**
   * Create a short link with a provided short code.
   */
  async create(item: URLShortenerItem): Promise<void> {
    const { error } = await this.supabase
      .from<URLShortenerItem>('urlshortener')
      .insert(item);

    if (error) throw error;
  }

  /**
   * Find recent links by IP.
   */
  async findRecentByIP(ip: string): Promise<URLShortenerItem[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.find('*', (q) =>
      q.eq('ip', ip).gt('created_at', oneWeekAgo.toISOString())
    );
  }

}

export default URLShortenerRepository

