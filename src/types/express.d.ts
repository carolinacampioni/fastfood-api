import { RequestHandler } from 'express';

declare global {
  namespace Express {
    export interface Request {
      params: any;
      body: any;
    }
    
    export interface Response {
      status(code: number): Response;
      json(data: any): Response;
      send(data: any): Response;
    }
  }
}

// Fix for Express route handlers
declare module 'express' {
  interface IRouterMatcher<T> {
    (path: string, ...handlers: RequestHandler[]): T;
  }
}
