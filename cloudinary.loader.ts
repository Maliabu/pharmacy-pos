// cloudinary-loader.ts

interface CloudinaryLoaderProps {
    src: string;
    width: number;
    quality?: number;
  }
  
  const cloudinaryLoader = ({ src, width, quality = 75 }: CloudinaryLoaderProps): string => {
    // Extract the base URL and image path from the src
    const url = new URL(src);
    const cloudinaryUrl = `https://res.cloudinary.com/dwklt6k9c/image/upload/c_limit,w_${width},q_${quality}/${url.pathname}`;
  
    return cloudinaryUrl;
  };
  
  export default cloudinaryLoader;
  