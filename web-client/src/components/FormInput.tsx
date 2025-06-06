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
    <input type={type} placeholder={placeholder} className='input' value={value} onChange={onChange}/>
  )
}
