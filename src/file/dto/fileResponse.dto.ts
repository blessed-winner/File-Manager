export class FileResponseDto{
    id: string
    url: string
    Name: string
    mime_type: string
    type: string
    size: number
    createdAt: Date

    constructor(partial: Partial<FileResponseDto>){
        Object.assign(this,partial)
    }
}