import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { State, StateSchema } from 'src/schemas/state.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: State.name, schema: StateSchema }]),
  ],
  providers: [StateService],
  controllers: [StateController],
})
export class StateModule {}
