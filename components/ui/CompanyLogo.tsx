import Image from "next/image";
import { APP_COMPANY } from "@/lib/app-brand";

interface CompanyLogoProps {
  variant?: "icon" | "full";
  theme?: "light" | "dark";
  name?: string;
  initials?: string;
  className?: string;
  imageClassName?: string;
}

function isAppBrand(name?: string): boolean {
  if (!name) return true;
  return name === APP_COMPANY.name || name.startsWith("Competra");
}

export function CompanyLogo({
  variant = "icon",
  theme = "light",
  name,
  initials,
  className = "",
  imageClassName = "",
}: CompanyLogoProps) {
  if (isAppBrand(name)) {
    const src = theme === "dark" ? APP_COMPANY.logoDark : APP_COMPANY.logoLight;

    if (variant === "full") {
      return (
        <Image
          src={src}
          alt={APP_COMPANY.name}
          width={200}
          height={80}
          priority
          className={`h-auto w-full max-w-[200px] object-contain ${imageClassName}`}
        />
      );
    }

    return (
      <div className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ${className}`}>
        <Image
          src={APP_COMPANY.logoDark}
          alt={APP_COMPANY.name}
          width={36}
          height={36}
          className={`h-full w-full object-cover object-top ${imageClassName}`}
        />
      </div>
    );
  }

  const label = (initials ?? name?.slice(0, 2) ?? "CO").toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-indigo-600 font-bold text-white ${
        variant === "full" ? "h-12 w-12 text-lg" : "h-9 w-9 text-sm"
      } ${className}`}
    >
      {label}
    </div>
  );
}
