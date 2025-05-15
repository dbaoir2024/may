import { supabase } from '../../lib/supabaseClient';
import { describe, it, expect } from 'vitest';

describe('Supabase Auth', () => {
  it('should sign in with email and password', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password'
    });
    
    expect(error).toBeNull();
    expect(data.user).toBeDefined();
  });

  it('should handle failed login', async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'wrong@example.com',
      password: 'wrong'
    });
    
    expect(error).not.toBeNull();
  });
});