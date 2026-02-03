import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private readonly jwt:JwtService,
        private readonly config:ConfigService
    ){}

    async signUp(dto:SignUpDto){
        const hashedPassword = await bcrypt.hash(dto.password,10);
        const newUser = this.userRepo.create({
            ...dto,
            password:hashedPassword
        })

        await this.userRepo.save(newUser)

        const token = await this.generateToken(newUser.email)

        return {
            message:"User registered successfully",
            access_token:token
        }
    }

    private async findUser(email?:string, username?:string){
        const isEmailAvailable = email !== undefined
        if(isEmailAvailable){
            return this.userRepo.findOne({where: { email}})
        } else {
            return this.userRepo.findOne({where: { username}})
        }
    }


    private async generateToken(email:string){
         const user = await this.userRepo.findOne({where: { email}})
         if(!user){
            throw new NotFoundException("Cannot find user for token generation!")
         }

         const payload = { sub: user.id, email: user.email, username:user.username}

         const access_token = await this.jwt.signAsync(payload, {
            secret:this.config.get<string>('JWT_SECRET'),
            expiresIn:'15m'
         })

         return access_token
         
    }


    async signIn(dto:LoginDto){
        const user = await this.findUser(dto.email, dto.username)
        if(!user){
            throw new UnauthorizedException("Invalid credentials")
        }

        const isValidPassword = await bcrypt.compare(dto.password, user.password)
        if(!isValidPassword){
            throw new UnauthorizedException("Invalid credentials")
        }

        const token = await this.generateToken(user.email)
        return {
            message:"User logged in successfully",
            access_token: token
        }
    }
}
