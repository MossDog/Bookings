import { Edit, Plus } from 'lucide-react'
import { cn } from '../../../utils/cn';

interface ImageSlot {
  path?: string;
  circle?: boolean;
}

export default function ImageSlot({
  path,
  circle = false
}: ImageSlot) {

  const rounding = circle ? " rounded-full " : " rounded-md ";
  
  if(path) {
    return (
      <div 
        className={cn(
          'rounded-md',
          'flex items-center justify-center w-full',
          'relative group'
        )}
      >
        <img 
          src={path} 
          alt='Gallery Item'
          className={`${rounding} w-full h-full object-cover`}
        />
        <button
          className={cn(
            'absolute top-2 right-2',
            'p-2 rounded-full',
            'bg-black/40 hover:bg-black/60',
            'transition-all duration-200',     
            'backdrop-blur-sm',
            'cursor-pointer',
            'opacity-0 group-hover:opacity-100'              
          )}
        >
          <Edit 
            size={24} 
            className='text-white drop-shadow-md'
          />
        </button>
      </div>
    )
  } else {
    return (
      <div 
        className={cn(
          'border-2 border-dotted border-gray-300',
          'bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer',
          'flex items-center justify-center w-full',
          rounding
        )}
      >
        <Plus size={35} className='text-gray-400'/>
      </div>
    )
  }
}
