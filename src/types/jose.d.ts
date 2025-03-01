/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'jose' {
  export interface JWTPayload {
    id: string
    email: string
    role: string
    [key: string]: any
  }
}