import { UploadForm } from "@/components/upload/upload-form";

export const dynamic = 'force-dynamic';

export default function UploadPage() {
  return (
    <div className="container max-w-2xl mx-auto py-10">
      <UploadForm />
    </div>
  );
}
