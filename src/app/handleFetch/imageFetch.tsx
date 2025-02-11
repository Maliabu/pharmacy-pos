/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  return url; // Since you already have the URL, no need to fetch
};

const ImageFetcher = () => {
  const imageUrl = 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/uploads/your-folder-name/your-image.jpg'; // Cloudinary URL

  // Use SWR directly for fetching the image URL (optional if you have the URL already)
  const { data, error } = useSWR(imageUrl, fetcher);

  if (error) return <div>Failed to load image</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Uploaded Image</h2>
      <img src={data} alt="Uploaded Image" width={400} height={300} />
    </div>
  );
};

export default ImageFetcher;
