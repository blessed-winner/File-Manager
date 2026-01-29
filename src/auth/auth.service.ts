import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>
    ){}
}