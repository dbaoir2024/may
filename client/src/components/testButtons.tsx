import { supabase } from '../lib/supabaseClient';

export const TestButtons = () => {
  const testAuth = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password'
    });
    console.log('Auth Result:', { data, error });
  };

  const testStorage = async () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const { data, error } = await supabase.storage
      .from('test-bucket')
      .upload('public/test.txt', file);
    console.log('Storage Result:', { data, error });
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      <button 
        onClick={testAuth}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Auth
      </button>
      <button 
        onClick={testStorage}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Test Storage
      </button>
    </div>
  );
};