import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      console.error('Token not found in the authorization header.');
      return false;
    }

    return this.authService
      .verifyToken(token)
      .then((decodedToken) => {
        request.user = decodedToken as { userId: string; user: string };
        console.log('Authenticated user:', request.user);
        return true;
      })
      .catch((error) => {
        console.error('Token verification failed:', error.message);
        console.error('Received Token for Verification:', token);
        console.error('Request URL:', request.url); // Add the request URL to logs
        // You can add more context or details to the logs as needed

        return false;
      });
  }

  extractTokenFromHeader(authorizationHeader: string): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
