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
