
import {
  type SupabaseClient,
  type PostgrestFilterBuilder
} from '@supabase/supabase-js'

/**
 * A generic Supabase repository class with Map-like interface, pagination,
 * and custom filters.
 */
export class SupabaseRepository<T, K extends keyof T> {

  constructor(
    private readonly supabase: SupabaseClient,
    private readonly table: string,
    private readonly primaryKey: string
  ) {}

  /**
   * Get a single item by primary key.
   */
  async get(key: K, select: string = '*'): Promise<T | null> {
    const { data, error } = await this.supabase
      .from<T>(this.table)
      .select(select)
      .eq(this.primaryKey, key)
      .maybeSingle()

    if (error) throw error
    return data
  }

  /**
   * Upsert an item by primary key.
   */
  async set(key: K, value: Partial<T>): Promise<void> {
    const payload = {
      ...value,
      [this.primaryKey]: key
    }

    const { error } = await this.supabase
      .from(this.table)
      .upsert(payload)

    if (error) throw error
  }

  /**
   * Delete an item by primary key.
   */
  async delete(key: K): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq(this.primaryKey, key)

    if (error) throw error
  }

  /**
   * List items with optional pagination and filters.
   */
  async list(
    select: string = '*',
    options?: {
      page?: number
      pageSize?: number
      where?: Partial<Record<keyof T, unknown>>
    }
  ): Promise<{ data: T[]; total: number }> {
    const { page = 1, pageSize = 50, where = {} } = options || {}

    let query = this.supabase
      .from<T>(this.table)
      .select(select, { count: 'exact' })

    // Apply where filters (equality only)
    for (const [key, value] of Object.entries(where)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    }

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error
    return { data: data || [], total: count || 0 }
  }

  /**
   * Find items with custom query builder.
   */
  async find(
    select: string = '*',
    filterFn: (query: PostgrestFilterBuilder<T>) =>
               PostgrestFilterBuilder<T> = (q) => q
  ): Promise<T[]> {
    const { data, error } = await filterFn(
      this.supabase.from<T>(this.table).select(select)
    )

    if (error) throw error
    return data
  }

  /**
   * Async iterable support (uses list internally).
   */
  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    let page = 1
    while (true) {
      const { data } = await this.list('*', { page, pageSize: 100 })
      for (const item of data) {
        yield item
      }
      if (data.length < 100) break
      page++
    }
  }

}

export default SupabaseRepository

