/* eslint-disable react-hooks/rules-of-hooks */
'use client' // ✅ Ensures this component runs only on the client side
import { zodResolver } from '@hookform/resolvers/zod'; // ✅ Import the zod resolver
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema.schemas';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse.type';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from "lucide-react";

const page = () => {

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);



  const router = useRouter();

  // Zod implements a schema for form validation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          // const message = response.data.message;
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message || 'An error occurred');
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }

    checkUsernameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast.success("Account created successfully!", {
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
    } catch (error) {
      console.log("Error in signUp user", error);
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message || 'An error occurred';

      toast.error("Error creating account", {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join MyTry Message</h1>
          <p className='mb-4'>Sign up to start your anonyms adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} onChange={(e) => {
                      field.onChange(e)
                      debounced(e.target.value)
                    }} />
                  </FormControl>
                  {isCheckingUsername && <Loader2Icon className='animate-spin' />}
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>test {usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2Icon className='mr-2 h-4 w-4 animate-spin' /> Please wait...
                  </>) : ('Sign Up')
              }
            </Button>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>
            Already a member?{' '}
            <Link href='/sign-in' className='text-blue-600 hover:text-blue-800'>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page;

/*
  🔑 **Key Concepts Used in this Sign-Up Page:**
  -------------------------------------------------
  1️⃣ **React Hook Form + Zod Validation**  
      - Form handling via `useForm()` with `zodResolver(signUpSchema)`.  
      - `signUpSchema` ensures form fields meet validation criteria.  

  2️⃣ **Username Availability Check (Debounced)**  
      - `useDebounceCallback` prevents excessive API calls.  
      - `useEffect` triggers `/api/check-username-unique` when `username` changes.  

  3️⃣ **Asynchronous API Calls with Axios**  
      - `axios.get()` checks username uniqueness.  
      - `axios.post()` sends form data to `/api/sign-up` for account creation.  

  4️⃣ **User Feedback & Loading States**  
      - `isCheckingUsername` shows a loading spinner while checking username.  
      - `isSubmitting` disables the submit button during form submission.  

  5️⃣ **Toast Notifications**  
      - `toast.success()` displays a success message upon successful sign-up.  
      - `toast.error()` handles API errors and shows appropriate messages.  

  6️⃣ **Client-Side Navigation**  
      - `useRouter().replace()` redirects user to email verification page.  

  7️⃣ **Tailwind CSS for UI Styling**  
      - Utility classes (`bg-gray-100`, `rounded-lg`, `shadow-md`) for a responsive UI.  

  ✅ **This page ensures smooth, user-friendly sign-ups with proper validation, error handling, and API integration.**
*/
