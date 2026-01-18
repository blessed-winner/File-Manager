import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class BulkDeleteDto{
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    ids:string[]
}