import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json(); // Parse JSON body
        console.log("Request Body:", data);
        
        return NextResponse.json({
            message: "Request received successfully",
            receivedData: data
        });
    } catch (error) {
        console.error("Error parsing request body:", error);
        return NextResponse.json({
            message: "Invalid request body",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 400 });
    }
}