import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    FileModule,
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    CloudinaryModule,
    TypeOrmModule.forRootAsync({
       imports: [ ConfigModule ],
       inject: [ ConfigService ],
       useFactory:(config: ConfigService) => ({
           type:'postgres',
           database:config.get<string>('DB_NAME'),
           host:config.get<string>('DB_HOST'),
           port:Number(config.get<string>('DB_PORT')),
           username:config.get<string>('DB_USERNAME'),
           password:config.get<string>('DB_PASSWORD'),
           entities: [],
           synchronize:true
       }) 
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
