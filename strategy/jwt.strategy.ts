import { Injectable, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "src/auth/entities/user.entity"
import { Repository } from "typeorm"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

export type JwtPayload = {
    sub:string,
    email:string,
    username:string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(
        @InjectRepository(User)
        private userRepo:Repository<User>,
        private config:ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: config.get<string>("JWT_SECRET")!
        })
    }

    async validate(payload:JwtPayload){
        const user = await this.userRepo.findOne({ 
            where:{id:payload.sub},
            select:{
               id:true,
               role:true
            }
         })

        if(!user){
            throw new NotFoundException("User Not Found")
        }

        return  {id:user.id, role:user.role} 
    }
}
