import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class BulkDownloadDto{
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    ids:string[]
}