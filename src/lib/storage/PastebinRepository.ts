
import { type SupabaseClient } from '@supabase/supabase-js';

import { SupabaseRepository } from '@/lib/storage/SupabaseRepository'

export interface PastebinItem {
  id: string;
  title: string;
  content: string;
  encryption: string;
  password_hash: string | null;
  salt: string | null;
  iv: string | null;
  cipher_algorithm: string | null;
  created_at: string;
  syntax: string | null;
  keywords: string[] | null;
}

export class PastebinRepository extends SupabaseRepository<PastebinItem, 'id'> {

  constructor(supabase: SupabaseClient) {
    super(supabase, 'pastebin', 'id');
  }

  /**
   * Create a new paste with auto-generated ID.
   */
  async create(item: Omit<PastebinItem, 'id'>): Promise<PastebinItem> {
    const { data, error } = await this.supabase
      .from<PastebinItem>('pastebin')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Find pastes by syntax or keywords.
   */
  async findBySyntax(syntax: string): Promise<PastebinItem[]> {
    return this.find('*', (q) => q.eq('syntax', syntax));
  }

}

export default PastebinRepository

