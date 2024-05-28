import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json()
    const queryText = body.queryText

    if (!queryText) {
        return NextResponse.json({ error: 'Query text is required' }, { status: 400 });
    }
  
    try {
      // Fetch all contacts from the database
      const contacts = await prisma.connections.findMany({
        select: {
          name: true,
          bio: true,
        },
      });
  
      // Combine all descriptions into a single string
      const combinedDescriptions = contacts.map(contact => `${contact.name}: ${contact.bio}`).join('\n');
  
      // Send the query to OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Given the following description of people, give me only the names and descriptions of the best people to contact for the following query:" },
          { role: "user", content: queryText },
          { role: "system", content: combinedDescriptions }
        ],
        max_tokens: 150,
      });
  
      // Parse the OpenAI API response to extract relevant contacts
      const openAIText = completion.choices[0].message.content.trim();
      console.log("this is open ai text: ", openAIText)
      const recommendedContacts = openAIText.split('\n').map(line => line.trim()).filter(line => line);
  
      return NextResponse.json(recommendedContacts, { status: 201 });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}