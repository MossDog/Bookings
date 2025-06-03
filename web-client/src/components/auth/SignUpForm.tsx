import React, { useState } from 'react'
import FormInput from '../FormInput'
import Button from '../Button'
import supabase from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function SignUpForm() {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const {data, error} = await supabase.auth.signUp({
      email, password
    }); 

    if(error){
      console.error("Error signing up: ", error);
    } else {
      console.log("Successful sign-up: ", data);
      navigate('/confirm');
    }
  }

  return (
    <form className='flex flex-col w-[480px] gap-2'>
      <FormInput type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
      <FormInput type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
      <Button onClick={onSubmit}>Sign up</Button>
    </form>
  )
}
