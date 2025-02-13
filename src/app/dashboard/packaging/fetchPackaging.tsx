"use client"
import useSWR from "swr";

// Fetcher function to get data from the API route
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Packaging() {
  // Use SWR to fetch data from your API route
  const { data, error } = useSWR("/api/packaging", fetcher);

  if (error) return <div>Please add some packaging</div>;
  if (!data) return <div>Loading packaging...</div>;

  return (
    <div>
      Select a packaging
    </div>
  );
}
