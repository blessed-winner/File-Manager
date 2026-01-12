import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    FileModule,
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
