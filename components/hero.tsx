"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Hero() {
  const [text, setText] = useState("");
  const fullText = "Code breaks... fix it faster";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80)",
          opacity: 0.3,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />

      <div className="container relative z-20">
        <div className="flex flex-col items-start justify-center min-h-[70vh] py-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-primary max-w-[50%] leading-tight">
            {text}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="inline-block ml-1"
            >
              |
            </motion.span>
          </h1>
          <p className="text-lg md:text-xl w-1/2 text-muted-foreground mb-8 ma  x-w-xl">
            Because debugging is twice as hard as writing the code in the first
            place. Buy our premium error fixes and get back to building features
            instead of fixing bugs. Your git blame history will thank you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg"
            >
              <Link href="/products/1">Fix Now</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-red-600 text-red-500 hover:bg-red-600/10 px-8 py-6 text-lg"
            >
              <Link href="#featured">Browse Featured Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
