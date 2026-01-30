import { Inject, Module } from '@nestjs/common';
import { LoginIdentifierValidator } from 'utils/validators/login_identifier.validator';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
      imports: [
            CloudinaryModule,
            TypeOrmModule.forFeature([User]),
            JwtModule.registerAsync({
                  imports: [ConfigModule],
                  inject: [ConfigService],
                  useFactory: (configService: ConfigService) => ({
                        secret: configService.get<string>('JWT_SECRET'),
                        signOptions: { expiresIn: '1h' },
                  })
            })
      ],
      providers: [AuthService,LoginIdentifierValidator],
      controllers: [AuthController]
})
export class AuthModule {}
