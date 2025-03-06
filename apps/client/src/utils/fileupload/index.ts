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
export const uploadFile = async (
  file: File,
  options?: {
    baseURL?: string;
    partSize?: number;
    concurrent?: number;
    maxRetry?: number;
    prefix?: string;
    onProgress?: (progress: number) => void;
  }
) => {
  // Default options
  const {
    baseURL = `${process.env.NEXT_PUBLIC_SERVER_LINK}/api/files/multipart`,
    partSize = 10 * 1024 * 1024, // 10MB
    concurrent = 3, // Increased concurrency for better performance
    maxRetry = 3,
    prefix,
    onProgress,
  } = options || {};

  // Helper function for fetch with base URL
  const fetchWithBase = async (
    path: string,
    action: string,
    options: RequestInit & {
      query?: Record<string, string>;
    } = {}
  ) => {
    const { query = {}, ...fetchOptions } = options;

    // Construct the URL with the proper structure for action and path
    const queryString = new URLSearchParams(query).toString();
    const fullUrl = `${baseURL}/${action}/${path}${queryString ? `?${queryString}` : ""}`;

    console.log(`Making request to: ${fullUrl}`, fetchOptions.method);

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${errorText}`
        );
      }

      // Try to parse as JSON, but handle non-JSON responses gracefully
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return response;
      }
    } catch (error) {
      console.error(`Request failed for ${path}:`, error);
      throw error;
    }
  };

  // Start the upload process
  const startUpload = async () => {
    try {
      // Create upload session
      console.log("Creating upload session for:", file.name);
      const data = await fetchWithBase(file.name, "create", {
        method: "POST",
      });
      console.log("Upload session created:", data);

      const { uploadId, pathname } = data;

      // Calculate chunks
      const chunks = Math.ceil(file.size / partSize);
      console.log(`File will be split into ${chunks} chunks`);

      const queue: number[] = Array.from({ length: chunks }, (_, i) => i + 1);
      const parts: any[] = [];
      const errors: Error[] = [];
      let canceled = false;
      let progress = 0;

      // Cancel function
      const cancel = async () => {
        if (canceled) return;
        canceled = true;
        queue.splice(0, queue.length);
        await fetchWithBase(pathname, "abort", {
          method: "DELETE",
          query: {
            uploadId,
          },
        });
        console.log("Upload canceled");
      };

      // Prepare a chunk
      const prepare = (partNumber: number) => {
        const start = (partNumber - 1) * partSize;
        const end = Math.min(start + partSize, file.size);
        const chunkBody = file.slice(start, end);
        return { partNumber, chunkBody };
      };

      // Process a chunk
      const process = async (partNumber: number): Promise<void> => {
        if (canceled) return;

        console.log(`Processing part ${partNumber}/${chunks}`);
        const prepared = prepare(partNumber);

        let retryCount = 0;
        let success = false;

        while (!success && retryCount < maxRetry && !canceled) {
          try {
            const part = await fetchWithBase(pathname, "upload", {
              method: "PUT",
              query: {
                uploadId,
                partNumber: prepared.partNumber.toString(),
              },
              body: prepared.chunkBody,
            });

            parts.push(part);
            success = true;

            // Update progress
            progress = (parts.length / chunks) * 100;
            if (onProgress) {
              onProgress(progress);
            }
            console.log(
              `Part ${partNumber} uploaded successfully. Progress: ${progress.toFixed(2)}%`
            );
          } catch (e) {
            retryCount++;
            console.error(
              `Error uploading part ${partNumber}, retry ${retryCount}/${maxRetry}:`,
              e
            );

            if (retryCount >= maxRetry) {
              if (e instanceof Error) {
                errors.push(e);
              }
              console.error(
                `Failed to upload part ${partNumber} after ${maxRetry} retries`
              );
              throw e;
            }

            // Wait before retrying
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
          }
        }

        // Process next part from queue
        const next = queue.shift();
        if (next) {
          return process(next);
        }
      };

      // Start concurrent uploads
      const workers: Promise<void>[] = [];

      for (let i = 0; i < Math.min(concurrent, chunks); i++) {
        const partNumber = queue.shift();
        if (partNumber) {
          workers.push(process(partNumber));
        }
      }

      await Promise.all(workers);

      // Check if completed successfully
      if (canceled) {
        console.log("Upload was canceled");
        return { success: false, reason: "canceled" };
      }

      if (parts.length < chunks) {
        console.log(
          `Upload incomplete: ${parts.length}/${chunks} parts uploaded`
        );
        return { success: false, reason: "incomplete" };
      }

      // Sort parts by part number to ensure correct order
      parts.sort((a, b) => a.PartNumber - b.PartNumber);

      // Complete the upload
      console.log("Completing upload with parts:", parts);
      const result = await fetchWithBase(pathname, "complete", {
        method: "POST",
        query: {
          uploadId,
        },
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parts }),
      });
      console.log("Upload completed successfully:", result);
      return { success: true, result };
    } catch (error) {
      console.error("Upload error:", error);
      return { success: false, error };
    }
  };

  return startUpload();
};

/**
 * Fetches user Object Data
 */
export async function fetchUserObjects<T>() {
  const videos = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_LINK}/api/files`
  );
  return videos.json() as T;
}
