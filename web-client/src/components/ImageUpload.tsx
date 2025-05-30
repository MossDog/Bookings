import React from 'react'
import supabase from '../utils/supabase';

interface ImageUploadProps{
  path:string;

}

export default function ImageUpload({
  path
} : ImageUploadProps) {

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Do something with the file, e.g., upload or preview
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage.from('esting').upload(path, file);
      if (error) {
        console.error('Upload error:', error.message);
      } else {
        console.log('File uploaded:', data);
      }
      console.log('Selected file:', file);
    }
  };

  return (
    <div>
      <input title="help" type="file" accept="image/*" onChange={handleFileChange}/>
    </div>
  )
}
