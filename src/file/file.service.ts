import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as Cloudinary } from 'cloudinary';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
    constructor(
        @Inject('CLOUDINARY') private cloudinary : typeof Cloudinary,
        @InjectRepository(File) private fileRepo: Repository<File>
  ){}

  async upload(file:Express.Multer.File){
     try {
        const cloudinaryResult = await this.uploadToCloudinary(file)
        const savedFile = await this.fileRepo.save({
            url:cloudinaryResult.secure_url,
            publicId:cloudinaryResult.public_id,
            originalName:file.originalname,
            mimetype:file.mimetype,
            resourceType:cloudinaryResult.resource_type,
            size:cloudinaryResult.bytes
        })
        return savedFile
     } catch (err) {
        console.log('Upload failed', err)
        throw new InternalServerErrorException('File upload failed. Please try again')
     }
  }

  private uploadToCloudinary(file:Express.Multer.File):Promise<any>{
       return new Promise((resolve,reject)=>{
         this.cloudinary.uploader.upload_stream(
            { folder:'uploads' },
            (err,result) => {
                if (err) return reject(err)
                resolve(result)
            }
         ).end(file.buffer)
       })
  } 
}
