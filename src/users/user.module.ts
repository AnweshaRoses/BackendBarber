import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, userModel } from '../schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService, } from '@nestjs/config';
import { AuthController } from 'src/auth/controller/auth.controller';
import { AuthService } from 'src/auth/service/auth.service';
import { Consumer, ConsumerSchema } from 'src/schemas/consumer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    userModel,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Consumer.name, schema: ConsumerSchema },
    ]),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
