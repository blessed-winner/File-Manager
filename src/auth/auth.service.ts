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

    private async findUserByEmail(email:string){
        return this.userRepo.findOne({where: { email}})
    }

    private async generateToken(){
        
    }


    async signIn(dto:LoginDto){
      
    }
}