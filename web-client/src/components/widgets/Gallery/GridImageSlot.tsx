import { Edit, Plus } from 'lucide-react'
import { cn } from '../../../utils/cn';

interface GridImageSlot {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  path?: string;
}

export default function GridImageSlot({
  x = 1,
  y = 1,
  width = 1,
  height = 1,
  path,
}: GridImageSlot) {
  
  if(path) {
    return (
      <div 
        className='relative group'
        style={{
          gridColumn: `${x} / span ${width}`,
          gridRow: `${y} / span ${height}`,
        }}
      >
        <img 
          src={path} 
          alt='Gallery Item'
          className='rounded-md '
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
          'bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer rounded-md',
          'flex items-center justify-center',
        )}
        style={{
          gridColumn: `${x} / span ${width}`,
          gridRow: `${y} / span ${height}`,
        }}
      >
        <Plus size={35} className='text-gray-400'/>
      </div>
    )
  }
}
