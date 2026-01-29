import { Module } from '@nestjs/common';
import { LoginIdentifierValidator } from 'utils/validators/login_identifier.validator';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
      imports: [CloudinaryModule,TypeOrmModule.forFeature([User])],
      providers: [AuthService,LoginIdentifierValidator],
      controllers: [AuthController]
})
export class AuthModule {}
