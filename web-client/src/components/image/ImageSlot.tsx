// TODO: Implement edit functionality.
// TODO: Disable upload if necessary

import { cn } from "../../utils/cn";
import { Edit, Plus } from "lucide-react";
import { useRef } from "react";

interface ImageSlotProps {
  gridOptions?: {
    // Assumes the container element uses a grid layout.
    x: number; // Starting column for the image (1 = first col)
    y: number; // Starting row for the image (1 = first row)
    width: number; // How many columns to span
    height: number; // How many rows to span
  };
  circle?: boolean;
  bucketName?: string; // Accept but ignore
  filePath?: string;   // Accept but ignore
  imagePreviewUrl?: string | null; // Only used for display
  onImageSelected?: (file: File, previewUrl: string) => void;
}

export default function ImageSlot({
  gridOptions,
  circle = false,
  bucketName, // accepted but unused
  filePath,   // accepted but unused
  imagePreviewUrl = null,
  onImageSelected,
}: ImageSlotProps) {
  // Mark as intentionally unused to satisfy linter/build
  void bucketName;
  void filePath;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPreviewUrl = useRef<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous preview URL if it exists
      if (lastPreviewUrl.current) {
        URL.revokeObjectURL(lastPreviewUrl.current);
      }
      const previewUrl = URL.createObjectURL(file);
      lastPreviewUrl.current = previewUrl;
      if (onImageSelected) onImageSelected(file, previewUrl);
      // Reset file input so selecting the same file again triggers change
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const rounding = circle ? "rounded-full" : "rounded-md";

  // Sets the grid position of the image if the gridOptions prop is present
  const gridStyles = gridOptions
    ? {
        gridColumn: `${gridOptions.x} / span ${gridOptions.width}`,
        gridRow: `${gridOptions.y} / span ${gridOptions.height}`,
      }
    : undefined;

  return (
    <div
      className={cn(
        "relative group w-full h-full",
        imagePreviewUrl != null
          ? ""
          : "border-2 border-dotted border-base-300 bg-base-100 hover:bg-base-200",
        "flex items-center justify-center",
        rounding,
      )}
      style={gridStyles}
    >
      {imagePreviewUrl != null ? (
        <ImagePart imageUrl={imagePreviewUrl} rounding={rounding} />
      ) : (
        <UploadPart onChange={handleFileUpload} fileInputRef={fileInputRef} />
      )}
    </div>
  );
}

interface ImagePartProps {
  imageUrl: string;
  rounding: string;
}

// Subcomponent to display the image when it is present in the bucket.

function ImagePart({ imageUrl, rounding }: ImagePartProps) {
  return (
    <>
      <img
        src={imageUrl}
        alt="Image preview"
        className={cn("w-full h-full object-cover", rounding)}
      />
      <button
        className={cn(
          "absolute top-2 right-2 p-2 rounded-full",
          "bg-base-content/40 hover:bg-base-content/60",
          "transition-all duration-200 backdrop-blur-sm",
          "cursor-pointer opacity-0 group-hover:opacity-100",
        )}
        type="button"
        title="Edit image"
        tabIndex={-1}
        aria-label="Edit image"
      >
        <Edit size={24} className="text-base-100 drop-shadow-md" />
      </button>
    </>
  );
}

interface UploadPartProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

function UploadPart({ onChange, fileInputRef }: UploadPartProps) {
  return (
    <>
      <input type="file" id="fileInput" hidden onChange={onChange} ref={fileInputRef} />
      <label htmlFor="fileInput">
        <Plus size={35} className="text-base-content/40" />
      </label>
    </>
  );
}
