import React from 'react'

interface FormInputProps {
  type: 'email' | 'text' | 'password';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any;
}

export default function FormInput({
  type,
  placeholder,
  value,
  onChange
}: FormInputProps) {
  return (
    <input type={type} placeholder={placeholder} className='border rounded-md border-gray-300 px-2 py-2' value={value} onChange={onChange}/>
  )
}
