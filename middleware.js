import { NextResponse } from "next/server";

export function middleware(req){
  const url = req.nextUrl.clone();
  switch(url.pathname) {
    case '/workspace':
      url.pathname = '/workspace/calendar';
      return NextResponse.redirect(url);

    case '/seminar':
      url.pathname = '/seminar/schedule';
      return NextResponse.redirect(url);

  }
}