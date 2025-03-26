'use client';

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import AutoPlay from "embla-carousel-autoplay"
import messages from "@/messages.json"

const page = () => {
  return (
    <>
      {/* Main container for the page */}
      <main className='flex flex-col flex-grow items-center justify-center px-4 md:px-24 py-12'>

        {/* Section for the page title and description */}
        <section className='text-center mb-8 md:mb-16'>
          <h1 className='text-3xl md:text-5xl font-bold'>Dive into the World of Anonymous Conversations</h1>
          <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore the depths of the internet with our anonymous chat platform.</p>
        </section>

        {/* Carousel for displaying messages dynamically */}
        <Carousel
          className="w-full max-w-xs"
          plugins={[AutoPlay({ delay: 2000 })]} // Enables auto-play functionality with a 2s delay
        >
          <CarouselContent>
            {
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      {/* Card header containing the message title */}
                      <CardHeader>
                        <h2 className="text-center text-3xl font-bold tracking-tight">{message.title}</h2>
                      </CardHeader>

                      {/* Card content displaying the main message */}
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-xl text-center tracking-tighter">
                          {message.content}
                        </span>
                      </CardContent>

                      {/* Card footer showing the received timestamp */}
                      <CardFooter>
                        <p className="text-sm text-center">{message.received}</p>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

      {/* Footer section */}
      <footer className="text-center p-4 md:p-6">
        <p className="text-lg">© 2025 MyTryMessage Anonymous Chat. All rights reserved.</p>
      </footer>
    </>
  );
};

export default page;

/* 
------------------------------------
🎯 Concept Summary:
------------------------------------
1. **Purpose:** 
   - This React component (`page.tsx`) displays an anonymous messaging platform.
   - It includes a carousel that rotates messages dynamically.

2. **Components Used:**
   - **ShadCN UI Components**: `Card`, `Carousel`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`
   - **AutoPlay Plugin**: Enables automatic sliding of the carousel.
   - **JSON Data (`messages.json`)**: Provides the list of messages.

3. **Functionality:**
   - The page renders a title, description, and a message carousel.
   - Messages from `messages.json` are displayed in a **card format**.
   - The carousel auto-plays every **2 seconds**.

4. **Expected Behavior:**
   - The user sees a **smoothly rotating** carousel of anonymous messages.
   - The messages change automatically every **2 seconds**.
   - The footer remains **static** at the bottom of the page.

------------------------------------
📌 Key Takeaways:
------------------------------------
✅ Uses `use client` to enable React interactive behavior.  
✅ Implements `AutoPlay` to create a dynamic carousel.  
✅ Uses a structured JSON (`messages.json`) to store messages.  
✅ Well-structured, responsive layout using Tailwind CSS.  

🔥 This setup ensures a clean UI with **seamless message rotation** for users.
*/
