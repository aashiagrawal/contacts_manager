import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || undefined;

    try {
        const records = await prisma.connections.findMany({
            where: name ? {name}: {}
        });
        console.log(records)
        return NextResponse.json(records);
    } catch (error) {
        console.log("reached catch")
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({error: errorMessage}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}

// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();
//         const {name, img_link, bio, connection_date} = body;

//         if (!name) {
//             return NextResponse.json({ error: "Name is required" }, { status: 400 });
//         }

//         const newRecord = await prisma.connections.create({
//             data: {
//                 name,
//                 img_link,
//                 bio,
//                 connection_date
//             }
//         })
//         return NextResponse.json(newRecord, { status: 201 });
//     } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//         return NextResponse.json({ error: errorMessage }, { status: 500 });
//     } finally {
//         await prisma.$disconnect();
//     }
// }

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const connections = body.connections;

        
        if (!Array.isArray(connections) || connections.length === 0) {
            return NextResponse.json({ error: "No connections provided" }, { status: 400 });
        }
        
        const createdConnections = [];
        
        for (const connection of connections) {
            const { name, img_link, bio, connection_date } = connection;
            
            if (!name || !img_link) {
                continue; // Skip invalid connections
            }
            
            // Check if a record with the same name and connection_date already exists
            const existingRecord = await prisma.connections.findUnique({
                where: {
                    name_img_link: {
                        name: name, 
                            img_link: img_link
                        }
                    }
            });

            if (!existingRecord) {
                // If the record does not exist, create a new record
                const newRecord = await prisma.connections.create({
                    data: {
                        name,
                        img_link,
                        bio,
                        connection_date,
                    },
                });
                createdConnections.push(newRecord);
            }
        }

        return NextResponse.json(createdConnections, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}