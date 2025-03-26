'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message, User } from '@/model/User.model'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema.schemas'
import { ApiResponse } from '@/types/ApiResponse.type'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const Page = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const { data: session } = useSession();
    const user = session?.user as User | undefined;

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    // 🔹 Fetch Accept Messages Status
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessage || false);
        } catch (error) {
            console.error(error);
            toast.error((error as AxiosError<ApiResponse>)?.response?.data?.message || 'Failed to fetch user status');
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    // 🔹 Fetch User Messages
    const fetchMessages = useCallback(async (refresh = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages || []);
            if (refresh) toast.success('Messages refreshed successfully');
        } catch (error) {
            console.error(error);
            toast.error((error as AxiosError<ApiResponse>)?.response?.data?.message || 'Failed to fetch messages');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 🔹 Fetch Data on Component Mount
    useEffect(() => {
        if (!user) return;
        fetchMessages();
        fetchAcceptMessage();
    }, [user, fetchAcceptMessage, fetchMessages]);

    // 🔹 Handle Message Deletion
    const handleDeleteMessage = (messageId: string) => {
        setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
    };

    // 🔹 Handle Switch Toggle for Accepting Messages
    const handleSwitchChange = async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessages: !acceptMessages });
            setValue('acceptMessages', !acceptMessages);
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            toast.error((error as AxiosError<ApiResponse>)?.response?.data?.message || 'Failed to update user status');
        } finally {
            setIsSwitchLoading(false);
        }
    };

    // 🔹 Generate and Copy Profile URL
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${user?.username}`;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success('Profile URL copied to clipboard');
    };

    if (!user) {
        return <div>Not Authenticated. You must be logged in to view this page</div>;
    }

    return (
        <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white w-full max-w-6xl rounded'>
            <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>

            {/* 🔹 Copy Profile URL */}
            <div className='mb-4'>
                <h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>
                <div className='flex items-center'>
                    <input type='text' value={profileUrl} disabled className='input input-bordered w-full p-2 mr-2' />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            {/* 🔹 Accept Messages Switch */}
            <div className='mb-4 flex items-center'>
                <Switch {...register('acceptMessages')} checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading} />
                <span className='ml-2'>Accept Messages: {acceptMessages ? 'ON' : 'OFF'}</span>
            </div>

            <Separator />

            {/* 🔹 Refresh Messages Button */}
            <Button className='mt-4' onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
            }}>
                {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <RefreshCcw className='h-4 w-4' />}
            </Button>

            {/* 🔹 Messages List */}
            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard key={message._id as string} message={message} onMessageDelete={handleDeleteMessage} />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
};

export default Page;


// 'use client'

// /* eslint-disable react-hooks/rules-of-hooks */
// import MessageCard from '@/components/MessageCard'
// import { Button } from '@/components/ui/button'
// import { Separator } from '@/components/ui/separator'
// import { Switch } from '@/components/ui/switch'
// import { Message, User } from '@/model/User.model'
// import { acceptMessageSchema } from '@/schemas/acceptMessageSchema.schemas'
// import { ApiResponse } from '@/types/ApiResponse.type'
// import { zodResolver } from '@hookform/resolvers/zod'
// import axios, { AxiosError } from 'axios'
// import { Loader2, RefreshCcw } from 'lucide-react'
// import { useSession } from 'next-auth/react'
// import React, { useCallback, useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { toast } from 'sonner'

// const page = () => {
//     const [messages, setMessages] = useState<Message[]>([])
//     const [isLoading, setIsLoading] = useState<boolean>(false)
//     const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)

//     const handleDeleteMessage = (messageId: string) => {
//         setMessages(messages.filter((message) => message._id !== messageId))
//     }

//     const { data: session } = useSession();

//     const form = useForm({
//         resolver: zodResolver(acceptMessageSchema)
//     })

//     const { register, watch, setValue } = form;

//     const acceptMessages = watch('acceptMessages')

//     const fetchAcceptMessage = useCallback(async () => {
//         setIsSwitchLoading(true)
//         try {
//             const response = await axios.get<ApiResponse>('/api/accept-messages')
//             setValue('acceptMessages', response.data.isAcceptingMessage || false)
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>
//             toast.error(axiosError.response?.data.message || 'Failed to fetch user status')
//         } finally {
//             setIsSwitchLoading(false)
//         }
//     }, [setValue])

//     const fetchMessages = useCallback(async (refresh: boolean = false) => {
//         setIsLoading(true)
//         setIsSwitchLoading(false)
//         try {
//             const response = await axios.get<ApiResponse>('/api/get-messages')
//             setMessages(response.data.messages || [])
//             if (refresh) {
//                 toast.success('Messages refreshed successfully')
//             }
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>
//             toast.error(axiosError.response?.data.message || 'Failed to fetch messages')
//         } finally {
//             setIsLoading(false)
//             setIsSwitchLoading(false)
//         }
//     }, [setIsLoading, setMessages])

//     useEffect(() => {
//         if (!session || !session.user) return
//         fetchMessages()
//         fetchAcceptMessage()
//     }, [setValue, session, fetchAcceptMessage, fetchMessages])

//     // handle switch change
//     const handleSwitchChange = async () => {
//         try {
//             const response = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessages: !acceptMessages })
//             setValue('acceptMessages', !acceptMessages)
//             toast.success(response.data.message)
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>
//             toast.error(axiosError.response?.data.message || 'Failed to update user status')
//         }
//     }

//     const { username } = session?.user as User;

//     const baseUrl = `${window.location.protocol}//${window.location.host}`
//     const profileUrl = `${baseUrl}/u/${username}`

//     const copyToClipboard = () => {
//         navigator.clipboard.writeText(profileUrl)
//         toast.success('Profile URL copied to clipboard')
//     }

//     if (!session || !session.user) {
//         return <div>Not Authenticated. You must be logged in to view this page</div>
//     }

//     return (
//         <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white w-full max-w-6xl rounded'>
//             <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
//             <div className='mb-4'>
//                 <h2 className='text-lg font-semibold mb-2'>
//                     Copy Your Unique Link
//                 </h2>{' '}
//                 <div className='flex items-center'>
//                     <input
//                         type='text'
//                         value={profileUrl}
//                         disabled
//                         className='input input-bordered w-full p-2 mr-2'
//                     />
//                     <Button
//                         onClick={copyToClipboard}
//                     >
//                         Copy
//                     </Button>
//                 </div>
//             </div>
//             <div className='mb-4'>
//                 <Switch {...register('acceptMessages')} checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading} />
//                 <span className='ml-2'>
//                     Accept Messages: {acceptMessages ? 'ON' : 'OFF'}
//                 </span>
//             </div>
//             <Separator />
//             <Button className='mt-4' onClick={(e) => {
//                 e.preventDefault();
//                 fetchMessages(true)
//             }} >
//                 {isLoading ? (
//                     <Loader2 className='h-4 w-4 animate-spin' />
//                 ) : (
//                     <RefreshCcw className='h-4 w-4' />
//                 )}
//             </Button>
//             <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
//                 {messages.length > 0 ? (
//                     messages.map((message) => (
//                         <MessageCard key={String(message._id)} message={message} onMessageDelete={handleDeleteMessage} />
//                     ))
//                 ) : (
//                     <p>No messages to display.</p>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default page