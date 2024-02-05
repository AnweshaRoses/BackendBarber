import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  HttpStatus,
  NotFoundException,
  Get,
  Put,
  Delete,
  //   Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { CreateShopDto, UpdateShopDto } from 'src/dto/shop.dto';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createShop(
    @Body() createShopDto: CreateShopDto,
    @Request() req: any,
    @Res() res: any,
  ) {
    const userId = req.user.userId;

    const userType = req.user.userType;

    if (userType !== 'provider') {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User does not have the required userType for shop creation',
      });
    }

    try {
      const createdShop = await this.shopService.createShop(
        createShopDto,
        userId,
      );
      // Include userId in the response data
      const responseData = {
        ...createdShop.toObject(),
      };

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Shop created successfully',
        data: responseData,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Failed to create shop',
          error: error.message,
        });
      }
    }
  }
  @Get()
  async getAllShops(@Res() res: any) {
    try {
      const shops = await this.shopService.getAllShops();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Shops retrieved successfully',
        data: shops,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to retrieve shops',
        error: error.message,
      });
    }
  }

  @Get('getid')
  @UseGuards(JwtAuthGuard)
  async getShopByUserId(@Res() res: any, @Request() req: any) {
    const userId = req.user.userId;

    try {
      const shop = await this.shopService.getShopByUserId(userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Shop retrieved successfully',
        data: shop,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to retrieve shop',
        error: error.message,
      });
    }
  }
  @Put('/update')
  @UseGuards(JwtAuthGuard)
  async updateShop(
    @Body() updateShopDto: UpdateShopDto,
    @Request() req: any,
    @Res() res: any,
  ) {
    const userId = req.user.userId;

    try {
      const updatedShop = await this.shopService.updateShop(
        userId,
        updateShopDto,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Shop updated successfully',
        data: updatedShop,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to update shop',
        error: error.message,
      });
    }
  }
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteShop(@Res() res: any, @Request() req: any) {
    const userId = req.user.userId;

    try {
      await this.shopService.deleteShop(userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Shop deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to delete shop',
        error: error.message,
      });
    }
  }
}
