'use client' // ✅ Ensures this component runs only on the client side
/* eslint-disable react-hooks/rules-of-hooks */
import { zodResolver } from '@hookform/resolvers/zod'; // ✅ Import the zod resolver
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { signInSchema } from '@/schemas/signInSchema.schemas';

const page = () => {

  const router = useRouter();

  // Zod implements a schema for form validation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log("Submitting form with data:", data);

    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    console.log("Sign-in result:", result);

    if (result?.error) {
      toast.error("Invalid credentials", {
        description: result.error, // Check exact error
      });
    } else if (result?.url) {
      router.replace("/dashboard");
    } else {
      toast.error("Unexpected error occurred during login.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join MyTry Message</h1>
          <p className='mb-4'>Sign in to start your anonyms adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input type='text' autoComplete='username' placeholder="email/username" {...field} />
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
                    <Input type='password' autoComplete='current-password' placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>
              Sign In
            </Button>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>
            If have not account then sing up?{' '}
            <Link href='/sign-up' className='text-blue-600 hover:text-blue-800'>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page;