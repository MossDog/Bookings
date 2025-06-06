import React, { useState } from 'react'
import FormInput from '../FormInput'
import Button from '../Button'
import supabase from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setError(null); // Clear previous errors
    const {data, error} = await supabase.auth.signInWithPassword({
      email, password
    });

    if(error){
      setError("Invalid email or password. Please try again.");
      console.error("Error logging in: ", error);
    } else {
      console.log("Successful login: ", data);
      navigate("/");
    }
  }

  return (
    <form className='flex flex-col w-[480px] gap-2'>
      {error && (
        <div className="alert alert-error text-red-600 bg-red-100 border border-red-400 rounded p-2 mb-2">
          {error}
        </div>
      )}
      <FormInput type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
      <FormInput type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
      <Button onClick={onSubmit}>Login</Button>
    </form>
  )
}