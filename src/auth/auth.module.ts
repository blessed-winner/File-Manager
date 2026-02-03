import { Inject, Module } from '@nestjs/common';
import { LoginIdentifierValidator } from 'utils/validators/login_identifier.validator';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'strategy/jwt.strategy';

@Module({
      imports: [
            CloudinaryModule,
            TypeOrmModule.forFeature([User]),
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtModule.registerAsync({
                  imports: [ConfigModule],
                  inject: [ConfigService],
                  useFactory: (configService: ConfigService) => ({
                        secret: configService.get<string>('JWT_SECRET'),
                        signOptions: { expiresIn: '1h' },
                  })
            })
      ],
      providers: [AuthService,LoginIdentifierValidator, JwtStrategy],
      controllers: [AuthController]
})
export class AuthModule {}
