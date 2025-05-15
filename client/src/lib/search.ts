import { pool } from "./../../../server/src/lib/db"; // Import your PostgreSQL query function

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: {
    name: string;
    email: string;
  };
  document_type: string;
}

export const searchDocuments = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];

  try {
    // Full-text search using PostgreSQL
    const { rows } = await pool.query<{
      id: string;
      title: string;
      content: string;
      created_at: string;
      document_type: string;
      user_name: string;
      user_email: string;
    }>(`
      SELECT 
        d.id,
        d.title,
        d.content,
        d.created_at,
        d.document_type,
        u.name as user_name,
        u.email as user_email
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE to_tsvector('english', d.title || ' ' || d.content) @@ websearch_to_tsquery('english', $1)
      ORDER BY d.created_at DESC
    `, [query]);

    return rows.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      created_at: doc.created_at,
      document_type: doc.document_type,
      author: {
        name: doc.user_name || 'Unknown',
        email: doc.user_email || ''
      }
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};