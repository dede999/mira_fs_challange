"use client";
import { FormComponent } from "@/components/form";
import { Box, Heading } from "@chakra-ui/react";
import { useTransition } from "react";

export default function Home() {
  const [_, startTransition] = useTransition();

  return (
    <Box>
      <Heading as="h1" className="text-4xl sm:text-6xl font-bold">
        Check if a user can go out worldwide
      </Heading>
      <FormComponent transition={startTransition} />
    </Box>
  );
}
