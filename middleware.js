import { NextResponse, userAgent } from "next/server";

export function middleware(req){

  // Anti-bot
  if(userAgent(req)?.isBot){
    // return new Response("Be human.", {status: 403});
    // response 불가능하도록 바뀜. 페이지 redirection 필요함. https://nextjs.org/docs/messages/returning-response-body-in-middleware
  }

  const url = req.nextUrl.clone();

  // Custom redirection.
  // console.log(url)
  switch(url.pathname) {
    case '/workspace/[utility]':
      url.pathname = '/workspace/calendar';
      return NextResponse.redirect(url);

    case '/seminar/[menu]':
      url.pathname = '/seminar/schedule';
      return NextResponse.redirect(url);
  }

  // Redirection if not logged in.
  // console.log(req.cookies.has('ascl-portal-session'))
  if(!req.url.includes("/api")){
    if(!req.url.includes("/enter")&&!req.cookies.has('ascl-portal-session'))
    {
      url.pathname = '/enter';
      return NextResponse.redirect(url);
    }
  }

  // url.pathname = '/enter';
  // return NextResponse.redirect(url);
}

// export const config = {
//   matcher: "/",
// };

export const config = {
  unstable_includeFiles: [
    'node_modules/next/dist/compiled/@edge-runtime/primitives/**/*.+(js|json)',
  ],
  matcher: "/((?!api|_next/static|favicon.ico).*)",
}