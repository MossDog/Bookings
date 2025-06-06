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
      className='btn'
      onClick={onClick}  
    >
      {children}
    </button>
  )
}
