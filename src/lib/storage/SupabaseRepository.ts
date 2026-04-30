
import {
  type SupabaseClient
} from '@supabase/supabase-js'

export type Filter<T> = {
  [K in keyof T]?: {
    eq?: T[K];
    neq?: T[K];
    gt?: T[K];
    gte?: T[K];
    lt?: T[K];
    lte?: T[K];
    like?: string;
    ilike?: string;
    is?: boolean | null;
    in?: T[K][];
  };
};

export type FilterCondition<T> = {
  eq?: T;
  neq?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  like?: string;
  ilike?: string;
  is?: boolean | null;
  in?: T[];
};

/**
 * A generic Supabase repository class with Map-like interface, pagination,
 * and custom filters.
 */
export class SupabaseRepository<T extends object, K extends keyof T & string> {

  constructor(
    protected readonly supabase: SupabaseClient,
    protected readonly table: string,
    protected readonly primaryKey: K
  ) {}

  /**
   * Get a single item by primary key.
   */
  async get(key: T[K], select: string = '*'): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(select)
      .eq(String(this.primaryKey), key)
      .maybeSingle()

    if (error) throw error
    return data as unknown as T | null
  }

  /**
   * Upsert an item by primary key.
   */
  async set(key: T[K], value: Partial<T>): Promise<void> {
    const payload = {
      ...value,
      [this.primaryKey]: key
    } as Partial<T> & Pick<T, K>

    const { error } = await this.supabase
      .from(this.table)
      .upsert(payload as T)

    if (error) throw error
  }

  /**
   * Delete an item by primary key.
   */
  async delete(key: T[K]): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq(String(this.primaryKey), key)

    if (error) throw error
  }

  /**
   * List items with optional pagination and filters.
   *
   * // Example: Fetch users older than 18 and younger than 30
   * const result = await userRepository.list('*', {
   *   pageSize: 30,
   *   where: {
   *     age: { gt: 18, lt: 30 },
   *     name: { like: '%john%' },
   *     isActive: { is: true },
   *     id: { in: [1, 2, 3] },
   *   },
   * });
   */
  async list(
    select: string = '*',
    options?: {
      page?: number;
      pageSize?: number;
      where?: Filter<T>;
    }
  ): Promise<{ data: T[]; total: number }> {
    const { page = 1, pageSize = 50, where = {} } = options || {};

    let query = this.supabase
      .from(this.table)
      .select(select, { count: 'exact' });

    // Apply filters
    for (const [key, conditions] of Object.entries(where)) {

      if (typeof conditions === 'object' && conditions !== null) {
        const cond = conditions as FilterCondition<unknown>;
        if (cond.eq !== undefined) {
          query = query.eq(key, cond.eq);
        }
        if (cond.neq !== undefined) {
          query = query.neq(key, cond.neq);
        }
        if (cond.gt !== undefined) {
          query = query.gt(key, cond.gt);
        }
        if (cond.gte !== undefined) {
          query = query.gte(key, cond.gte);
        }
        if (cond.lt !== undefined) {
          query = query.lt(key, cond.lt);
        }
        if (cond.lte !== undefined) {
          query = query.lte(key, cond.lte);
        }
        if (cond.like !== undefined) {
          query = query.like(key, cond.like);
        }
        if (cond.ilike !== undefined) {
          query = query.ilike(key, cond.ilike);
        }
        if (cond.is !== undefined) {
          query = query.is(key, cond.is);
        }
        if (cond.in && Array.isArray(cond.in)) {
          query = query.in(key, cond.in);
        }
      }

    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;
    // Explicitly cast data to T[]
    return { data: (data as unknown as T[]) || [], total: count || 0 };
  }

  /**
   * Find items with equality filter
   * example: await repository.find('*', { syntax: 'typescript' });
   */
  async find(
    select: string = '*',
    where: Partial<Record<keyof T, unknown>> = {}
  ): Promise<T[]> {
    let query = this.supabase.from(this.table).select(select);
    // Apply filters from the where object
    for (const [key, value] of Object.entries(where)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value); // Only supports equality checks
      }
    }
    const { data, error } = await query;
    if (error) throw error;
    // Explicitly cast data to T[]
    return (data as unknown as T[]) || [];
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

