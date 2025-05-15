import '@testing-library/jest-dom/vitest';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { supabase } from '../lib/supabaseClient';

// Mock Supabase client if needed
beforeAll(() => {
  // Setup code if required
});

afterEach(async () => {
  // Clean up after each test
  await supabase.auth.signOut();
});

afterAll(() => {
  // Global clean up
});