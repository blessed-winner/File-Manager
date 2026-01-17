import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as Cloudinary } from 'cloudinary';
import { File } from './entities/file.entity';
import { getCloudinaryFolder, getResourceType } from 'utils/cloudinaryUtils';
import { getCloudinaryResourceType } from 'utils/cloudinaryUtils';
import { FileResponseDto } from './dto/fileResponse.dto';

@Injectable()
export class FileService {
    constructor(
        @Inject('CLOUDINARY') private cloudinary : typeof Cloudinary,
        @InjectRepository(File) private fileRepo: Repository<File>
  ){}

  async upload(file:Express.Multer.File){
     try {
        const resourceType = getResourceType(file.mimetype)
        const cloudinaryResult = await this.uploadToCloudinary(file,resourceType)
        const savedFile = await this.fileRepo.save({
            url:cloudinaryResult.secure_url,
            publicId:cloudinaryResult.public_id,
            originalName:file.originalname,
            mimeType:file.mimetype,
            resourceType,
            size:cloudinaryResult.bytes
        })
        //console.log(savedFile.mimeType)
        return savedFile
     } catch (err) {
        console.log('Upload failed', err)
        throw new InternalServerErrorException('File upload failed. Please try again')
     }
  }

  private uploadToCloudinary(file:Express.Multer.File,resourceType):Promise<any>{
       const folder = getCloudinaryFolder(resourceType)
       const cloudinaryResourceType = getCloudinaryResourceType(resourceType)

       return new Promise((resolve,reject)=>{
         this.cloudinary.uploader.upload_stream(
            { folder, resource_type:cloudinaryResourceType },
            (err,result) => {
                if (err) return reject(err)
                resolve(result)
            }
         ).end(file.buffer)
       })
  } 

  async listFiles():Promise<FileResponseDto[]>{
      const files =await this.fileRepo.find({
        order:{ createdAt:'DESC' }, 
        take:20,
        select:{
            id:true,
            url:true,
            originalName:true,
            resourceType:true,
            size:true,
        }
    })

    return files.map(file => new FileResponseDto({
        id: file.id,
        url: file.url,
        Name: file.originalName,
        type: file.resourceType,
        size: file.size,
    }))
  }

  async getFileInfo(id:string){
      const file = await this.fileRepo.findOneBy({ id })
      if(!file){
        throw new InternalServerErrorException('Something went wrong. Failed to fetch file info')
      }

      return new FileResponseDto({
        id: file.id,
        url: file.url,
        Name: file.originalName,
        mime_type: file.mimeType,
        type: file.resourceType,
        size: file.size,
        createdAt: file.createdAt
      })
  }

async getFileDownloadUrl(id: string): Promise<string> {
    try {
      const file = await this.fileRepo.findOneBy({ id });

      if (!file) {
        throw new NotFoundException(`File with ID "${id}" not found`);
      }

      const safeName = file.originalName
        .split('.')               
        .slice(0, -1)             
        .join('.')                
        .replace(/[^a-zA-Z0-9_-]/g, '_');

      const attachmentName = safeName || 'download';

      const downloadUrl = file.url.replace(
        /\/upload\//,
        `/upload/fl_attachment:${attachmentName}/`
      );

      return downloadUrl;

    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      console.error('Error generating Cloudinary download link:', err);
      throw new InternalServerErrorException(
        'Something went wrong. Failed to generate download link.'
      );
    }
  }

  private async deleteCloudinaryFile(publicId:string, resourceType:string){
        const result = await this.cloudinary.uploader.destroy(publicId,{resource_type:resourceType})
        if(result.result !== 'ok' && result.result !== 'not found'){
          throw new InternalServerErrorException('Failed to delete file from cloud storage')
        }
  }

  async deleteFile(id:string){
       try {
            const file = await this.fileRepo.findOneBy({ id })
            if(!file){
            throw new NotFoundException('File not found')
           }
           await this.deleteCloudinaryFile(file.publicId,file.resourceType)
           await this.fileRepo.remove(file)

           return { message: 'File deleted successfully' }
       } catch (err) {
          throw new InternalServerErrorException('Something went wrong. File deletion failed')
       }
      
  }
}