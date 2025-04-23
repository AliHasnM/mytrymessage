'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { User } from "@/model/User.model";

const Page = () => {
    const [message, setMessage] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { data: session } = useSession();
    const user = session?.user as User | undefined;

    const handleSend = async () => {
        if (!user) {
            toast.error("Username not found");
            return;
        }

        try {
            setIsLoading(true);
            await axios.post("/api/send-message", {
                username: user.username,
                content: message
            });
            toast.success("Message sent successfully");
            setMessage("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuggestions = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/suggestions");
            setSuggestions(response.data.suggestions || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch suggestions");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    return (
        <div className='max-w-xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg'>
            <h1 className='text-2xl font-bold mb-4'>Public Profile Link</h1>
            <div>
                <label className='block font-medium mb-2'>Write an anonymous message:</label>
                <Input type="text" placeholder="Write your message here" value={message} onChange={(e) => setMessage(e.target.value)} className="mb-4" />
                <Button onClick={handleSend} className='w-full mb-4' disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send It"}
                </Button>
            </div>
            <div>
                <Button variant='outline' onClick={fetchSuggestions} className='w-full mb-4' disabled={isLoading}>
                    {isLoading ? "Fetching..." : "Suggest Message"}
                </Button>

                {suggestions.length > 0 && (
                    <div className='mt-4'>
                        <h2 className='text-lg font-semibold mb-2'>Suggested Messages:</h2>
                        <div className='grid gap-2'>
                            {suggestions.map((msg, index) => (
                                <Card key={index} className='cursor-pointer' onClick={() => setMessage(msg)}>
                                    <CardContent className='p-4'>{msg}</CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
