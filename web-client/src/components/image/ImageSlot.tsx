import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { Edit, Plus } from 'lucide-react';
import supabase from '../../utils/supabase';

interface ImageSlotProps {
  gridOptions?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  circle?: boolean;
  path?: string;
}

export default function ImageSlot({
  gridOptions,
  circle = false,
  path
}: ImageSlotProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (path) {
      const fetchImage = async () => {
        const { data } = supabase.storage.from('esting').getPublicUrl(path);
        
        if(data){
          setImageUrl(data.publicUrl);
        }
      };
      fetchImage();
    }
  }, [path]);


  const rounding = circle ? 'rounded-full' : 'rounded-md';

  const gridStyles = gridOptions ? {
    gridColumn: `${gridOptions.x} / span ${gridOptions.width}`,
    gridRow: `${gridOptions.y} / span ${gridOptions.height}`,
  } : undefined;

  return (
    <div
      className={cn(
        'relative group w-full h-full',
        path ? '' : 'border-2 border-dotted border-gray-300 bg-gray-50 hover:bg-gray-100',
        'flex items-center justify-center',
        rounding
      )}
      style={gridStyles}
    >
      { imageUrl != null ? (
        <>
          <img 
            src={path}
            alt='Image'
            className={cn('w-full h-full object-cover', rounding)}
          />
          <button
            className={cn(
              'absolute top-2 right-2 p-2 rounded-full',
              'bg-black/40 hover:bg-black/60',
              'transition-all duration-200 backdrop-blur-sm',
              'cursor-pointer opacity-0 group-hover:opacity-100'
            )}
          >
            <Edit size={24} className='text-white drop-shadow-md' />
          </button>
        </>
      ) : (
        <Plus size={35}  className='text-gray-400' />
      )}
    </div>
  )
}
