import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from 'src/schemas/shop.schema';
import { CreateShopDto, UpdateShopDto } from 'src/dto/shop.dto';
import { Provider } from 'src/schemas/provider.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop.name) private readonly shopModel: Model<Shop>,
    @InjectModel(Provider.name) private readonly providerModel: Model<Provider>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createShop(createShopDto: CreateShopDto, userId: string) {
    // Find the provider based on the userId
    const provider = await this.providerModel.findOne({ user: userId }).exec();

    if (!provider) {
      throw new Error('Provider not found');
    }
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('User not found');
    }

    // Create the shop
    const createdShop = await this.shopModel.create({
      ...createShopDto,
      provider: provider._id, // Assign the provider ID to the shop
      user: user._id,
    });

    return createdShop;
  }
  async getAllShops() {
    return await this.shopModel.find().exec();
  }

  async getShopByUserId(userId: string): Promise<Shop> {
    console.log('Received userId:', userId); // Log the userId for debugging

    const shop = await this.shopModel
      .findOne({ user: userId }) // Modify the query to search by the 'user' field
      .exec();

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }
  async updateShop(
    userId: string,
    updateShopDto: UpdateShopDto,
  ): Promise<Shop> {
    const shop = await this.shopModel
      .findOneAndUpdate({ user: userId }, updateShopDto, { new: true })
      .exec();
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    return shop;
  }
  async deleteShop(userId: string): Promise<void> {
    const shop = await this.shopModel.findOneAndDelete({ user: userId }).exec();
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
  }
}
