import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from 'src/config/env.config';
import { JoiValidationSchema } from 'src/config/joi.validation';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema,
    }),

    StockModule,

  ],
})
export class AppModule { }