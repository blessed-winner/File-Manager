import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsString } from "class-validator";

export class SignUpDto{

    @ApiProperty({ example: "jdoe" })
    @IsString()
    username:string;

    @ApiProperty({ example: "jdoe@example.com" })
    @IsString()
    @IsEmail()
    email:string;

    @ApiProperty({ example: "StrongPassword123!" })
    @IsString()
    password:string;

    @ApiProperty({ example: "Jane" })
    @IsString()
    firstName:string;

    @ApiProperty({ example: "Doe" })
    @IsString()
    lastName:string;

    @ApiProperty({ example: "1990-04-22" })
    @IsDateString()
    dateOfBirth:Date;
}
