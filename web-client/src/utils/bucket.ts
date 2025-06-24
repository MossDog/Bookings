import supabase from "./supabase";

export const fileExistsInBucket = async (
  bucketName: string,
  filePath: string,
): Promise<boolean> => {
  const pathSegments = filePath.split("/");
  const fileName = pathSegments.pop();
  const path = pathSegments.join("/");

  const { data, error } = await supabase.storage.from(bucketName).list(path);

  if (error) {
    console.error(
      `Error checking if file exists in bucket '${bucketName}': `,
      error,
    );
    return false;
  }

  return data?.some((file) => file.name === fileName);
};

export const getPublicUrl = async (
  bucketName: string,
  filePath: string,
): Promise<string | null> => {
  const imageExists = await fileExistsInBucket(bucketName, filePath);
  if (!imageExists) {
    return null;
  }

  const { data } = await supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (!data) {
    console.error(`Error fetching file in bucket '${bucketName}'`);
    return null;
  }

  console.log(data.publicUrl);
  return data.publicUrl;
};

export const upload = async (
  bucketName: string,
  filePath: string,
  file: File,
) => {
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (error) {
    console.error(`Error uploading file in bucket '${bucketName}'`);
  }
};

/**
 * Returns a Supabase public image URL with a cache-busting query string to ensure the latest image is fetched.
 * @param userId The user ID or folder for the image.
 * @param type The image type (e.g., 'profileimage' or 'bannerimage').
 * @returns The cache-busted public image URL.
 */
export function getSupabaseImageUrl(
  userId: string,
  type: "profileimage" | "bannerimage",
) {
  const base = `https://diuvtcenidxquipjwyzh.supabase.co/storage/v1/object/public/public.images/${userId}/${type}`;
  return `${base}?cb=${Date.now()}`;
}

/**
 * Returns a Supabase public image URL with a cache-busting query string for any file path.
 * @param filePath The full path to the image in the bucket (e.g. 'city_maps/filename.jpg' or 'userId/profileimage').
 * @returns The cache-busted public image URL.
 */
export function getSupabaseImageUrlForPath(filePath: string) {
  const base = `https://diuvtcenidxquipjwyzh.supabase.co/storage/v1/object/public/public.images/${filePath}`;
  return `${base}?cb=${Date.now()}`;
}
