import { supabase } from '../../lib/supabaseClient';
import { describe, it, expect } from 'vitest';

describe('Supabase Storage', () => {
  const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

  it('should upload a file', async () => {
    const { data, error } = await supabase.storage
      .from('test-bucket')
      .upload('public/test.txt', testFile);
    
    expect(error).toBeNull();
    expect(data?.path).toBeDefined();
  });

  it('should retrieve a file', async () => {
    const { data } = await supabase.storage
      .from('test-bucket')
      .createSignedUrl('public/test.txt', 60);
    
    expect(data?.signedUrl).toBeDefined();
  });
});