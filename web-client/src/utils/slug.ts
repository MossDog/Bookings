import supabase from "./supabase";

export function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/--+/g, "-"); // Replace multiple dashes with one
}

export async function generateUniqueSlug(baseSlug: string, tableName: string) {
  let slug = baseSlug;
  let counter = 1;

  const { data } = await supabase
    .from(tableName)
    .select("slug")
    .ilike("slug", `${baseSlug}%`);

  if (data) {
    const existingSlugs = data.map((b) => b.slug);
    while (existingSlugs.includes(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }
  }

  return slug;
}
