export { auth as middleware } from "auth"

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|Channel|channel|undefined|backend|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
