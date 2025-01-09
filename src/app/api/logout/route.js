import dbConnect from '@/lib/dbConnect'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {

    await dbConnect();

    try {
        const cookieStore = cookies()
        
        // Clear the auth token cookie
        cookieStore.delete('token')

        return NextResponse.json(
            { message: 'Logged out successfully' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: 'Error during logout' },
            { status: 500 }
        )
    }
}