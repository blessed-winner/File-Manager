import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [CloudinaryModule,TypeOrmModule.forFeature([File]), AuthModule],
  providers: [FileService, RolesGuard],
  controllers: [FileController]
})
export class FileModule {}
