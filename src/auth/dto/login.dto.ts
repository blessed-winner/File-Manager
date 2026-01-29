import { IsEmail, IsOptional, IsString, Validate } from "class-validator"
import { LoginIdentifierValidator } from "utils/validators/login_identifier.validator"

export class LoginDto{
    @IsString()
    @IsEmail()
    @IsOptional()
    email:string


    @IsString()
    @IsOptional()
    username:string

    @IsString()
    password:string

    @Validate(LoginIdentifierValidator)
    checkFields:string
}