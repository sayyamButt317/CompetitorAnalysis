interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
};

const colors = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

function getColor(name: string): string {
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function Avatar({ name, imageUrl, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className={`shrink-0 rounded-full object-cover ${sizeMap[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${getColor(name)} ${sizeMap[size]} ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
