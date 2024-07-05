"use client";
import { FormComponent } from "@/components/form";
import { Heading } from "@chakra-ui/react";
import { Montserrat } from "next/font/google";
import { useTransition } from "react";

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  const [_, startTransition] = useTransition();

  return (
    <div
      className={`bg-gray-250 font-sans text-indigo-50 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ${montserrat.className}`}
    >
      <Heading as="h1" className="text-4xl sm:text-6xl font-bold">
        Check if a user can go out worldwide
      </Heading>
      <FormComponent transition={startTransition} />
    </div>
  );
}
