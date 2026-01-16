import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service';

@Controller('file')
export class FileController {
   constructor(
     private readonly fileService:FileService
   ){} 
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file:Express.Multer.File){
       return this.fileService.upload(file)
  }

  @Get('all')
  async getAllFiles(){
      return this.fileService.listFiles()
  }

  @Get(':id')
  async getFileInfo(@Param('id') id:string){
      return this.fileService.getFileInfo(id)
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id:string, @Res() res){
     const downloadUrl = await this.fileService.getFileDownloadUrl(id)
     return res.redirect(downloadUrl)
  }
}
