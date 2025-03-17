"use client"
import { Button } from '@/components/ui/button'


import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema.schemas'
import { ApiResponse } from '@/types/ApiResponse.type'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import * as z from 'zod'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast.success("Verification successful!", {
                description: response.data.message,
            });

            router.replace('/sign-in')

        } catch (error) {
            console.log("Error in verifying user", error);
            const axiosError = error as AxiosError<ApiResponse>

            const errorMessage = axiosError.response?.data.message || 'An error occurred';

            toast.error("Error verifying account", {
                description: errorMessage,
            })
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verify your Account</h1>
                    <p className='mb-4'>Enter the code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" >Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount

/*
  🔑 **Key Concepts Used in this Account Verification Page:**
  -----------------------------------------------------------
  1️⃣ **React Hook Form + Zod Validation**  
      - `useForm()` is used with `zodResolver(verifySchema)` to validate input.  

  2️⃣ **Retrieving URL Parameters**  
      - `useParams<{ username: string }>()` extracts `username` from the URL.  

  3️⃣ **Asynchronous API Call for Verification**  
      - `axios.post('/api/verify-code')` sends `username` and `code` to the backend.  

  4️⃣ **User Feedback with Toast Notifications**  
      - `toast.success()` displays a success message upon successful verification.  
      - `toast.error()` handles and displays error messages.  

  5️⃣ **Client-Side Navigation**  
      - `useRouter().replace('sign-in')` redirects the user to the Sign-In page after successful verification.  

  6️⃣ **Tailwind CSS for UI Styling**  
      - Responsive and clean UI using utility classes like `bg-gray-100`, `rounded-lg`, and `shadow-md`.  

  ✅ **This page ensures a smooth and secure verification process with user-friendly feedback.**
*/
