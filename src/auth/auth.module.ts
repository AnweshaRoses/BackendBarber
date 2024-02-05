import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthorizationMiddleware } from './controller/authorization.middleware';
import { JwtAuthGuard } from './controller/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('*'); // Apply middleware to all routes
  }
}
