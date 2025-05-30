import React from 'react'

interface ButtonProps {
  children: React.ReactNode,
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => any;
}

export default function Button({
  children,
  onClick
}: ButtonProps) {
  return (
    <button 
      className='bg-slate-700 text-white rounded-md px-2 py-4 cursor-pointer hover:bg-slate-500'
      onClick={onClick}  
    >
      {children}
    </button>
  )
}
