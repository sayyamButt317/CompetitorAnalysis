import { displayText } from "@/lib/format";

interface OverviewCompanyCatalogProps {
  keywords: string[];
  products: string[];
  features: string[];
}

export function OverviewCompanyCatalog({
  keywords,
  products,
  features,
}: OverviewCompanyCatalogProps) {
  if (keywords.length === 0 && products.length === 0 && features.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Company Catalog</h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <TagColumn title="Keywords" items={keywords} tone="indigo" />
        <TagColumn title="Products" items={products} tone="violet" />
        <TagColumn title="Features" items={features} tone="sky" />
      </div>
    </section>
  );
}

function TagColumn({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "indigo" | "violet" | "sky";
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-700",
    violet: "bg-violet-50 text-violet-700",
    sky: "bg-sky-50 text-sky-700",
  };

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400">None listed</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, index) => (
            <span
              key={`${displayText(item)}-${index}`}
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
            >
              {displayText(item)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
