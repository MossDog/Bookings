import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { Edit, Plus } from 'lucide-react';
import { fileExistsInBucket, getPublicUrl } from '../../utils/bucketUtils';

interface ImageSlotProps {
  gridOptions?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  circle?: boolean;
  bucketName: string;
  filePath: string;
}

export default function ImageSlot({
  gridOptions,
  circle = false,
  filePath,
  bucketName
}: ImageSlotProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      
      try {
        const imageExists = await fileExistsInBucket(bucketName, filePath);

        if(imageExists){
          const url = await getPublicUrl(bucketName, filePath);
          setImageUrl(url);
        } else {
          setImageUrl(null);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchImage();
  }, [bucketName, filePath]);


  const rounding = circle ? 'rounded-full' : 'rounded-md';

  const gridStyles = gridOptions ? {
    gridColumn: `${gridOptions.x} / span ${gridOptions.width}`,
    gridRow: `${gridOptions.y} / span ${gridOptions.height}`,
  } : undefined;

  return (
    <div
      className={cn(
        'relative group w-full h-full',
        imageUrl != null ? '' : 'border-2 border-dotted border-gray-300 bg-gray-50 hover:bg-gray-100',
        'flex items-center justify-center',
        rounding
      )}
      style={gridStyles}
    >
      {isLoading ? (
        <span className="loading loading-dots loading-xl"></span>
      ) : (
        imageUrl != null ? (
          <ImagePart imageUrl={imageUrl} rounding={rounding} />
        ) : (
          <Plus size={35} className='text-gray-400'/>
        )
      )}
    </div>
  )
}

interface ImagePartProps {
  imageUrl: string;
  rounding: string;
}

function ImagePart ({
  imageUrl,
  rounding
}: ImagePartProps) {
  return (
    <>
      <img 
        src={imageUrl}
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
  )
}