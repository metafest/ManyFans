"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { uploadFile as uploadFileToServer } from "@/utils";

export const UploadForm = () => {
  const [file, setFile] = React.useState<File>();
  const [isUploading, setIsUploading] = React.useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const currentFile = event.target.files[0];
      setFile(currentFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const success = await uploadFileToServer(file);

      if (!success) throw new Error("Upload failed");

      toast.success("File uploaded successfully", {
        description: "Redirecting to video page...",
      });

      router.push("gallery");
    } catch (error) {
      toast.error("Upload failed", {
        description: "Please try again later",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center p-8 cursor-pointer "
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <span className="text-sm font-medium">
            {file ? file.name : "Click to upload video"}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            Supported formats: MP4, MKV, AVI, MOV (max 1GB)
          </span>
          <input
            type="file"
            accept=".mp4,.mkv,.avi,.mov,.flv,.wmv,.webm,.mpeg,.3gp,.ogg"
            id="file-upload"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
