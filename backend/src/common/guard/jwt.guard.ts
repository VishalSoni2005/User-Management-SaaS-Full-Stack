import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // optionally you can override handleRequest to customize errors
  handleRequest(err: any, user: any, info: any) {
    return user;
  }
}

// import { AuthGuard } from '@nestjs/passport';

// export class JwtGuard extends AuthGuard('jwt') {
//   constructor() {
//     super();
//   }
// }
