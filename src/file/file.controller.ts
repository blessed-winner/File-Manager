import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service';
import { BulkDeleteDto } from './dto/bulkDelete.dto';

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

  @Delete(':id')
  async deleteFile(@Param('id') id:string){
      return this.fileService.deleteFile(id)
  }

  @Post('bulk/delete')
  async bulkDeleteFiles(@Body() bulkDeleteDto: BulkDeleteDto){
    const { ids } = bulkDeleteDto

    const files = await this.fileService.findFilesByIds(ids)

     return this.fileService.bulkDelete(files)
  }
}
