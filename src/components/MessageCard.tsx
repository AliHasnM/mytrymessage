'use client'
// Ye directive batata hai ke ye component sirf client side pe chalega. 
// Ye zaroori hota hai jab hum UI interactions, browser APIs ya state use karte hain.

import React from 'react'

// UI ka Card component jo ek styled container provide karta hai content ko clearly dikhane ke liye
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

// Alert Dialog ek confirmation popup deta hai jab user koi destructive action (delete etc.) kare
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Reusable button component for user interaction
import { Button } from './ui/button'

// X icon from lucide-react used for the delete button
import { X } from 'lucide-react'

// Message ka type import kar rahe hain jo backend model se aaya hai
import { Message } from '@/model/User.model'

// Notification dikhane ke liye library (toasts) use ho rahi hai
import { toast } from 'sonner'

// API call karne ke liye axios (async HTTP request)
import axios from 'axios'

// API se expected response ka custom type
import { ApiResponse } from '@/types/ApiResponse.type'

// Props define kar rahe hain taake component ko data aur function parent se mile
type MessageCardProps = {
    message: Message; // Ek single message object
    onMessageDelete: (messageId: string) => void // Callback jab message delete ho jaye
}

// Ye main component hai jo ek single message ko card ke format mein show karta hai
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    // Jab user delete confirm karta hai to ye function call hota hai
    const handleDeleteConfirm = async () => {
        try {
            // Backend API call jo message ko delete karti hai
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);

            // Agar delete successful ho to success toast show karo
            toast.success(response.data.message);

            // Parent component ko inform karo ke ye message delete ho gaya
            onMessageDelete(String(message._id));
        } catch (error) {
            // Agar koi error aaye to error toast show karo
            toast.error("Failed to delete message");
            console.error(error);
        }
    }

    return (
        // Card component start - UI ko divide karne ke liye use hota hai
        <Card className="relative">

            {/* Card ka header part - title aur time display hota hai */}
            <CardHeader>
                <CardTitle>Anonymous</CardTitle>
                {/* Agar username dynamic ho to yahan message.username ya message.senderName use karo */}

                {/* Message ka time human readable format mein show ho raha hai */}
                <CardDescription className="text-sm text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString()}
                </CardDescription>

                {/* Alert Dialog - delete button ke click pe confirmation deta hai */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        {/* Red delete button with X icon */}
                        <Button variant="destructive" className="absolute top-2 right-2 p-1 rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>

                    {/* Dialog content - user ko delete confirm karne ka option deta hai */}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>

            {/* Card ka main body jahan message ka actual content show hota hai */}
            <CardContent>
                <p className="text-base">{message.content}</p>
            </CardContent>

            {/* Card ka footer jahan optional info jaise message ID display ho sakti hai */}
            <CardFooter>
                <p className="text-xs text-gray-400">ID: {String(message._id)}</p>
            </CardFooter>
        </Card>
    )
}

export default MessageCard // Component ko export kar rahe hain taake baaki app mein use ho sake