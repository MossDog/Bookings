import React, { useState } from "react";
import supabase from "../utils/supabase";
import Button from "./Button";

interface ImageUploadProps {
  path: string;
}

export default function ImageUpload({ path }: ImageUploadProps) {
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    setFile(file);
  };

  const handleUpload = async () => {
    if (file) {
      const { data, error } = await supabase.storage
        .from("esting")
        .upload(path, file);
      if (error) {
        console.error("Upload error:", error.message);
      } else {
        console.log("File uploaded:", data);
      }
      console.log("Selected file:", file);
    }
  };

  return (
    <div className="border border-slate-700 bg-slate-100 w-fit rounded-lg flex gap-2 justify-center items-center">
      <Button onClick={handleUpload}>Choose Image</Button>
      <label htmlFor="file-input" className="min-w-[200px]">
        {file ? file.name : "No image chosen."}
      </label>
      <input
        hidden
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
