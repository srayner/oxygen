declare module '@srayner02/svix-admin/server' {
  type Ctx = { params: Promise<{ path: string[] }> }
  export function handler(req: Request, ctx: Ctx): Promise<Response>
  export { handler as GET, handler as POST, handler as PATCH, handler as DELETE }
}
