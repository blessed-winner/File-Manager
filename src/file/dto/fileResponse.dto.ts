import { IsDateString, IsNumber, IsString } from "class-validator"

export class FileResponseDto{
    @IsString()
    id: string

    @IsString()
    url: string

    @IsString()
    name: string

    @IsString()
    mime_type: string

    @IsString()
    type: string

    @IsNumber()
    size: number

    @IsDateString()
    createdAt: string

    constructor(partial: Partial<FileResponseDto>){
        Object.assign(this,partial)
    }
}