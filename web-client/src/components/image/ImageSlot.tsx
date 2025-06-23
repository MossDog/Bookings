// TODO: Implement edit functionality.
// TODO: Disable upload if necessary

import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import { Edit, Plus } from "lucide-react";

interface ImageSlotProps {
  gridOptions?: {
    // Assumes the container element uses a grid layout.
    x: number; // Starting column for the image (1 = first col)
    y: number; // Starting row for the image (1 = first row)
    width: number; // How many columns to span
    height: number; // How many rows to span
  };
  circle?: boolean;
  bucketName: string;
  filePath: string;
  imagePreviewUrl?: string | null; // NEW: preview URL from parent state
  onImageSelected?: (file: File, previewUrl: string) => void; // NEW: callback to parent
}

export default function ImageSlot({
  gridOptions,
  circle = false,
  filePath,
  bucketName,
  imagePreviewUrl = null,
  onImageSelected,
}: ImageSlotProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(imagePreviewUrl);

  useEffect(() => {
    setImageUrl(imagePreviewUrl);
  }, [imagePreviewUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      if (onImageSelected) onImageSelected(file, previewUrl);
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
        imageUrl != null
          ? ""
          : "border-2 border-dotted border-base-300 bg-base-100 hover:bg-base-200",
        "flex items-center justify-center",
        rounding,
      )}
      style={gridStyles}
    >
      {imageUrl != null ? (
        <ImagePart imageUrl={imageUrl} rounding={rounding} />
      ) : (
        <UploadPart onChange={handleFileUpload} />
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
        alt="Image"
        className={cn("w-full h-full object-cover", rounding)}
      />
      <button
        className={cn(
          "absolute top-2 right-2 p-2 rounded-full",
          "bg-base-content/40 hover:bg-base-content/60",
          "transition-all duration-200 backdrop-blur-sm",
          "cursor-pointer opacity-0 group-hover:opacity-100",
        )}
      >
        <Edit size={24} className="text-base-100 drop-shadow-md" />
      </button>
    </>
  );
}

interface UploadPartProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadPart({ onChange }: UploadPartProps) {
  return (
    <>
      <input type="file" id="fileInput" hidden onChange={onChange} />
      <label htmlFor="fileInput">
        <Plus size={35} className="text-base-content/40" />
      </label>
    </>
  );
}
