import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';
import { CreateSlotDto, UpdateSlotDto } from 'src/dto/slot.dto';

@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createSlot(
    @Body() createSlotDto: CreateSlotDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    // console.log('Received slotDate:', createSlotDto.date);
    const userType = req.user.userType;

    try {
      // Ensure only providers can create slots
      if (userType !== 'provider') {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message:
            'User does not have the required userType for creating slots',
        });
      }

      const createdSlots = await this.slotService.createSlot(createSlotDto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Slots created successfully',
        data: createdSlots,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to create slots',
        error: error.message,
      });
    }
  }
  @Get('all')
  async getAllSlots(@Res() res: any) {
    try {
      const slots = await this.slotService.getAllSlots();
      res.status(HttpStatus.OK).json({ success: true, slots });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({
          success: false,
          message: error.message,
        });
      } else {
        console.error('Unhandled error in getAllSlots:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }
  @Get('id')
  @UseGuards(JwtAuthGuard)
  async getSlotById(@Body() requestBody: { id: string }, @Res() res) {
    const { id } = requestBody;

    try {
      const slot = await this.slotService.getSlotById(id);
      if (!slot) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Slot not found',
        });
      }
      res.status(HttpStatus.OK).json({ success: true, slot });
    } catch (error) {
      console.error('Error in getSlotById:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  @Put('update')
  @UseGuards(JwtAuthGuard)
  async updateSlotById(
    @Body(new ValidationPipe())
    requestBody: { id: string; updateSlotDto: UpdateSlotDto },
    @Res() res: any,
  ) {
    const { id, updateSlotDto } = requestBody;

    try {
      if (!id || !updateSlotDto) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid request body',
        });
      }

      const updatedSlot = await this.slotService.updateSlotById(
        id,
        updateSlotDto,
      );

      if (!updatedSlot) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Slot not found',
        });
      }

      // If update is successful, return the updated slot
      return res.status(HttpStatus.OK).json({ success: true, updatedSlot });
    } catch (error) {
      console.error('Error updating slot:', error);

      // Check if the error is a ConflictException and customize the response accordingly
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          success: false,
          message: error.message, // Include the error message in the response
        });
      }

      // For other errors, return a generic internal server error message
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteSlot(@Body() requestBody: { id: string }, @Res() res: any) {
    try {
      const { id } = requestBody;
      if (!id) {
        throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
      }
      await this.slotService.deleteSlotById(id);
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: 'Slot deleted successfully' });
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
