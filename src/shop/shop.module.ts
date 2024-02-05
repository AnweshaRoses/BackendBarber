import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Shop, ShopSchema } from 'src/schemas/shop.schema';
import { Provider, ProviderSchema } from 'src/schemas/provider.schema';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { AuthService } from 'src/auth/service/auth.service'; // Import AuthService
import { User, UserSchema } from 'src/schemas/user.schema'; // Import User model

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shop.name, schema: ShopSchema },
      { name: Provider.name, schema: ProviderSchema },
      { name: User.name, schema: UserSchema }, // Import User model schema
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [ShopController],
  providers: [ShopService, JwtAuthGuard, AuthService],
})
export class ShopModule {}
