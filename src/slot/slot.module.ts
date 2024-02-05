import { Module } from '@nestjs/common';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { AuthService } from 'src/auth/service/auth.service';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import { Shop, ShopSchema } from 'src/schemas/shop.schema';
import { Slot, SlotSchema } from 'src/schemas/slot.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Slot.name, schema: SlotSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SlotController],
  providers: [SlotService, JwtAuthGuard, AuthService],
})
export class SlotModule {}
