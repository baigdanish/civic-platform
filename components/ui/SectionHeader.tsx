type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">
        {eyebrow}
      </p>
      <h1 className="font-serif text-4xl leading-tight text-slate-900 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
