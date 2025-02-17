/**
 * Uploads a file to the server.
 *
 * @param file - The file to be uploaded
 * @returns Promise that resolves to a boolean indicating whether the upload was successful
 *
 * @throws {Error} Network or server errors are caught and return false
 *
 * @example
 * ```typescript
 * const file = new File(['content'], 'example.txt');
 * const success = await uploadFile(file);
 * if (success) {
 *   console.log('File uploaded successfully');
 * }
 * ```
 */
export const uploadFile = async (file: File): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_LINK}/api/fileupload`,
      {
        method: "POST",
        body: formData,
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Fetches user Object Data
 */
export async function fetchUserObjects<T>() {
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  const videos = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_LINK}/api/fileupload`
  );
  return videos.json() as T;
}
