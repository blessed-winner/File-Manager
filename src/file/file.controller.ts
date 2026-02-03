import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service';
import { BulkDeleteDto } from './dto/bulkDelete.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('file')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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
  @Roles(Role.ADMIN)
  async deleteFile(@Param('id') id:string){
      return this.fileService.deleteFile(id)
  }

  @Post('bulk/delete')
  @Roles(Role.ADMIN)
  async bulkDeleteFiles(@Body() bulkDeleteDto: BulkDeleteDto){
    const { ids } = bulkDeleteDto

    const files = await this.fileService.findFilesByIds(ids)

     return this.fileService.bulkDelete(files)
  }
}
