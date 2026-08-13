export function hasOwn<T extends object>(
  value: T,
  key: PropertyKey,
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(value, key);
}

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

export function searchRecord<
  T extends {
    readonly name: string;
    readonly label: string;
    readonly aliases?: readonly string[];
    readonly tags?: readonly string[];
  },
>(record: Readonly<Record<string, T>>, query: string): T[] {
  const needle = normalizeSearch(query);
  if (!needle) return Object.values(record);

  return Object.values(record).filter((icon) => {
    const haystack = [
      icon.name,
      icon.label,
      ...(icon.aliases ?? []),
      ...(icon.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
