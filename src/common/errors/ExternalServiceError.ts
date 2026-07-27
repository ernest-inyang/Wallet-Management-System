export class ExternalServiceError extends Error {
    readonly statusCode = 503;
  
    constructor(message: string) {
      super(message);
    }
  }

