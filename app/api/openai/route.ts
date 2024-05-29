import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
    const queryText = await req.json()
    // const queryText = body.queryText


    if (!queryText) {
        console.log("this is body: ", body)
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
      const recommendedContacts = openAIText.split('\n').map(line => line.trim()).filter(line => line);

      const map = recommendedContacts.reduce((acc, item) => {
        const [key, value] = item.split(": ");
        acc.set(key, value);
        return acc;
      }, new Map<string, string>());
      
      const recommendations = []
      for (const [name, bio] of map.entries()) {
        const contacts = await prisma.connections.findMany({
            where: {
              name: name,
              bio: bio
            }
          });
        if (contacts) {
            contacts.map(item => recommendations.push(item))
            // console.log("this is a contact: ", contact)
            // recommendations.push(contact)
        }
      }
      
      return NextResponse.json(recommendations, { status: 201 });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}