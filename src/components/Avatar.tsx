interface AvatarProps {
  src?: string;
  alt: string; 
  className?: string;
}

export function Avatar({ src, alt, className = "" }: AvatarProps) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    alt
  )}&background=random&color=fff`;

  const initialSrc = src && src.trim() !== "" ? src : fallback;

  return (
    <img
      src={initialSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null; // Prevent infinite fallback loops
        e.currentTarget.src = fallback;
      }}
    />
  );
}