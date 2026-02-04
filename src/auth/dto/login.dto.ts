import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString, Validate } from "class-validator"
import { LoginIdentifierValidator } from "utils/validators/login_identifier.validator"

export class LoginDto{
    @ApiPropertyOptional({ example: "jdoe@example.com" })
    @IsString()
    @IsEmail()
    @IsOptional()
    email:string


    @ApiPropertyOptional({ example: "jdoe" })
    @IsString()
    @IsOptional()
    username:string

    @ApiProperty({ example: "StrongPassword123!" })
    @IsString()
    password:string

    @ApiHideProperty()
    @Validate(LoginIdentifierValidator)
    checkFields:string
}
