/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr';

// Define a fetch function for SWR to use (this would be like querying the DB)
const fetchItems = async (db: { query: (arg0: any) => any; }, query: any) => {
  const result = await db.query(query);
  return result;
};

const useQuery = (db: any, query: any) => {
  // Use SWR to manage caching, fetching, and re-fetching
  const { data, error, isValidating } = useSWR(
    query, 
    () => fetchItems(db, query),  // Call to our fetchItems function
    {
      revalidateOnFocus: false, // Don't re-fetch when the page is focused
    }
  );

  return { data, error, isValidating };
};

export default useQuery;
