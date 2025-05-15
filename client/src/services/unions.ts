import { supabase } from '../utils/db';

export interface Union {
  id: string;
  name: string;
  registration_number: string;
  status: 'Active' | 'Pending' | 'Deregistered';
  created_at: string;
}

export const getUnions = async (): Promise<Union[]> => {
  const { data, error } = await supabase
    .from('unions')
    .select('*');
    
  if (error) throw error;
  return data;
};

export const createUnion = async (union: Omit<Union, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('unions')
    .insert(union)
    .select();
    
  if (error) throw error;
  return data[0];
};