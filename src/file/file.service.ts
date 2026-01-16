import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as Cloudinary } from 'cloudinary';
import { File } from './entities/file.entity';
import { getResourceType } from 'utils/getFileResourceType';

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
       const folder = this.getCloudinaryFolder(resourceType)
       const cloudinaryResourceType = this.getCloudinaryResourceType(resourceType)

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

  private getCloudinaryResourceType(resourceType:string){
       if(resourceType == 'image') return 'image'
       if(resourceType == 'video') return 'video'
       return 'raw'
  }

  private getCloudinaryFolder(resourceType:string){
         if(resourceType == 'image') return 'images'
         if(resourceType == 'video') return 'videos'
         if(resourceType == 'audio') return 'audio'
         if(resourceType == 'text') return 'text'
         if(resourceType == 'document') return 'documents'
         return 'files'
}
}
