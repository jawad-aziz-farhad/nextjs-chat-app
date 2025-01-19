import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.next()
}
 