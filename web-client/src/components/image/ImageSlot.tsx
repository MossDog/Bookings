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
  imagePreviewUrl?: string | null; // Only used for display
  onImageSelected?: (file: File) => void;
}

export default function ImageSlot({
  gridOptions,
  circle = false,
  imagePreviewUrl = null,
  onImageSelected,
}: ImageSlotProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelected) {
      onImageSelected(file);
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
        imagePreviewUrl ? "" : "border-2 border-dotted border-base-300 bg-base-100 hover:bg-base-200",
        "flex items-center justify-center",
        rounding,
      )}
      style={gridStyles}
    >
      {imagePreviewUrl ? (
        <>
          <img
            src={imagePreviewUrl}
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
            tabIndex={0}
            aria-label="Edit image"
            onClick={() => fileInputRef.current?.click()}
          >
            <Edit size={24} className="text-base-100 drop-shadow-md" />
          </button>
          <input type="file" hidden onChange={handleFileUpload} ref={fileInputRef} />
        </>
      ) : (
        <>
          <input type="file" hidden onChange={handleFileUpload} ref={fileInputRef} />
          <label onClick={() => fileInputRef.current?.click()}>
            <Plus size={35} className="text-base-content/40" />
          </label>
        </>
      )}
    </div>
  );
}
