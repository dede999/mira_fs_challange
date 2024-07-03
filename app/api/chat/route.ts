// create Next.js 15 endpoint for AI chat using openai function
import {NextResponse} from "next/server";

type Params = {
  country: string
  state: string
  city: string
}

export async function POST(request: Request) {
  const body = await request.json() as Params

  return NextResponse.json({ message: 'Hello from the chat endpoint', parameters: body })
}