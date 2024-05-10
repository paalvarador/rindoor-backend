import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from 'express-oauth2-jwt-bearer';
import { config as dotenvConfig } from 'dotenv';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';
dotenvConfig({ path: '.env.development' });

@Injectable()
export class AuthGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;

  constructor(private configService: ConfigService) {
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE');
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.getArgByIndex(1);
    const res = context.getArgByIndex(2);

    const checkJwt = promisify(
      auth({
        audience: process.env.AUTH0_AUDIENCE_UR,
        issuerBaseURL: process.env.AUTH0_ISSUER_URL,
        tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
        jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
      }),
    );

    try {
      await checkJwt(req, res);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
