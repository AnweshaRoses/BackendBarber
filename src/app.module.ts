// app.module.ts

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';
import { CountryModule } from './country/country.module';
import { ConsumerModule } from './consumer/consumer.module';
import { AuthorizationMiddleware } from './auth/controller/authorization.middleware';
import { AuthModule } from './auth/auth.module';
import { ProviderModule } from './provider/provider.module';
import { ShopModule } from './shop/shop.module';
import { ServicesModule } from './services/services.module';
import { SlotModule } from './slot/slot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    CityModule,
    StateModule,
    CountryModule,
    ConsumerModule,
    AuthModule,
    ProviderModule,
    ShopModule,
    ServicesModule,
    SlotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthorizationMiddleware globally to all routes
    consumer.apply(AuthorizationMiddleware).forRoutes('*');
    // Apply the AuthorizationMiddleware specifically to the reset-password route
    consumer.apply(AuthorizationMiddleware).forRoutes('/auth/reset-password');
  }
}
