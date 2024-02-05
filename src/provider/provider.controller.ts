// provider.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  // Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto, UpdateProviderDto } from 'src/dto/provider.dto';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
// import { Provider } from 'src/schemas/provider.schema';

@Controller('providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProvider(
    @Body() createProviderDto: CreateProviderDto,
    @Request() req: any,
  ) {
    try {
      // Check if the user has the userType "provider"
      if (req.user && req.user.userType === 'provider') {
        const userId = req.user.userId; // Extract userId from the JWT token
        const createdProvider = await this.providerService.createProvider(
          createProviderDto,
          userId,
        );
        console.log('createdProvider:', createdProvider);

        return {
          success: true,
          data: createdProvider,
          message: 'Provider created successfully',
        };
      } else {
        return {
          success: false,
          message:
            'User does not have the required userType for provider creation',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create provider',
        error: error.message,
      };
    }
  }

  @Get()
  async getAllProviders() {
    const providers = await this.providerService.getAllProviders();
    return {
      success: true,
      data: providers,
      message: 'Providers retrieved successfully',
    };
  }

  @Get('/id')
  @UseGuards(JwtAuthGuard)
  async getProviderById(@Request() req: any) {
    try {
      const userId = req.user.userId; // Extract userId from the JWT token

      const userType = await this.providerService.getUserType(userId);

      // Check if the user has the userType "provider"
      if (userType === 'provider') {
        const provider = await this.providerService.getProviderByUserId(userId);

        if (!provider) {
          return {
            success: false,
            message: 'Provider not found',
          };
        }

        return {
          success: true,
          data: provider,
          message: 'Provider retrieved successfully',
        };
      } else {
        return {
          success: false,
          message:
            'User does not have the required userType for accessing provider information',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get provider by ID',
        error: error.message,
      };
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateProvider(
    @Body() updateProviderDto: UpdateProviderDto,
    @Request() req: any,
  ) {
    try {
      const userId = req.user.userId; // Extract userId from the JWT token

      const userType = await this.providerService.getUserType(userId);

      // Check if the user has the userType "provider"
      if (userType === 'provider') {
        const updatedProvider = await this.providerService.updateProvider(
          updateProviderDto,
          userId,
        );

        return {
          success: true,
          data: updatedProvider,
          message: 'Provider updated successfully',
        };
      } else {
        return {
          success: false,
          message:
            'User does not have the required userType for updating provider information',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update provider',
        error: error.message,
      };
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteProvider(@Request() req: any) {
    try {
      const userId = req.user.userId; // Extract userId from the JWT token

      const deletedProvider = await this.providerService.deleteProvider(userId);

      return {
        success: true,
        data: deletedProvider,
        message: 'Provider deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete provider',
        error: error.message,
      };
    }
  }
}
