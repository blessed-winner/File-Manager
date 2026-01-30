import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>
    ){}

    async signUp(dto:SignUpDto){
        
    }

    private async findUser(email?:string, username?:string){
        const isEmailAvailable = email !== undefined
        if(isEmailAvailable){
            return this.userRepo.findOne({where: { email}})
        } else {
            return this.userRepo.findOne({where: { username}})
        }
    }


    private async generateToken(){

    }


    async signIn(dto:LoginDto){
      
    }
}