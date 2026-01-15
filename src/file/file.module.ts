import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';

@Module({
  imports: [CloudinaryModule,TypeOrmModule.forFeature([File])],
  providers: [FileService],
  controllers: [FileController]
})
export class FileModule {}
