import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { Environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  public supabaseClient: SupabaseClient<Database>;

  constructor() {
    this.supabaseClient = createClient<Database>(
      Environment.SUPABASE_URL,
      Environment.SUPABASE_ANON_KEY,
    );
  }
}
