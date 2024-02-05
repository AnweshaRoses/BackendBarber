import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import { Shop, ShopSchema } from 'src/schemas/shop.schema';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { AuthService } from 'src/auth/service/auth.service';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [ServicesService, JwtAuthGuard, AuthService],
  controllers: [ServicesController],
})
export class ServicesModule {}
