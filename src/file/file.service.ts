import { HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { v2 as Cloudinary } from 'cloudinary';
import { File } from './entities/file.entity';
import { getResourceType } from 'utils/cloudinaryUtils';
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

  private uploadToCloudinary(file:Express.Multer.File,resourceType:string):Promise<any>{
      const FOLDER_MAP = {
        image:"user_images",
        video:"user_videos",
        raw:"user_files"
      }

       const cloudinaryResourceType = getResourceType(file.mimetype)
       const folder = FOLDER_MAP[cloudinaryResourceType] || 'user_files'

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
        name: file.originalName,
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
        name: file.originalName,
        mime_type: file.mimeType,
        type: file.resourceType,
        size: file.size,
        createdAt: file.createdAt.toISOString(),
      })
  }

async getFileDownloadUrl(id: string): Promise<string> {
  try {
    const file = await this.fileRepo.findOneBy({ id });

    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }

    // 'raw' resources (file) don't support fl_attachment transformation
    if (file.resourceType === 'raw' || file.resourceType === 'file') {
      return file.url;
    }

    const extension = file.originalName.split('.').pop() || '';
    const safeName = file.originalName
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/[^a-zA-Z0-9_-]/g, '_') || 'download';

    const attachmentFilename = extension ? `${safeName}.${extension}` : safeName;

    // IMPORTANT: Encode the filename to handle dots and special characters
    // and use a more robust regex to handle the /upload/ segment
    const encodedName = encodeURIComponent(attachmentFilename);
    
    const downloadUrl = file.url.replace(
      '/upload/',
      `/upload/fl_attachment:${encodedName}/`
    );

    return downloadUrl;

  } catch (err) {
    if (err instanceof NotFoundException) throw err;
    console.error('Error generating download link:', err);
    throw new InternalServerErrorException('Failed to generate download link.');
  }
}

  private async deleteCloudinaryFile(publicId:string, mimeType:string){
        try {
          const cloudinaryResourceType = getResourceType(mimeType)
          const result = await this.cloudinary.uploader.destroy(publicId,{resource_type:cloudinaryResourceType})
          if(result.result !== 'ok' && result.result !== 'not found'){
            throw new InternalServerErrorException('Failed to delete file from cloud storage')
          }
        } catch (err) {
          console.error('Cloudinary delete error:', err);
          // If it's a 404 (not found), it's safe to continue
          if (err.message && err.message.includes('404')) {
            console.warn(`File ${publicId} not found in Cloudinary, continuing...`);
            return;
          }
          throw err;
        }
  }

 async deleteFile(id: string) {
  try {
    const file = await this.fileRepo.findOneBy({ id });

    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }

    await this.deleteCloudinaryFile(file.publicId, file.mimeType);
    await this.fileRepo.remove(file);

    return { message: 'File deleted successfully' };
  } catch (err) {
    console.error('File deletion failed', err);
    throw err;
  }
}

  async bulkDelete(files: File[]){
  try {
    if (!files || !files.length) {
      return {
        deleted: 0,
        message: 'No files to delete',
      };
    }

    const grouped = files.reduce((acc, file) => {
      acc[file.resourceType] ??= [];
      acc[file.resourceType].push(file.publicId);
      return acc;
    }, {} as Record<string, string[]>);

    for (const [resourceType, publicIds] of Object.entries(grouped)) {
      try {
        await this.cloudinary.api.delete_resources(publicIds, {
          resource_type: getResourceType(resourceType),
        });
      } catch (err) {
        console.error(`Error deleting resources of type ${resourceType}:`, err);
        // Continue with database cleanup even if Cloudinary deletion fails
      }
    }

    await this.fileRepo.remove(files);

    return {deleted:files.length, message:"Files deleted successfully",files};
  } catch (err) {
    if (err instanceof NotFoundException) {
      throw err;
    }
    console.log('Bulk deletion failed', err);
    throw new InternalServerErrorException('Bulk file deletion failed');
  }
}

    async findFilesByIds(ids:string[]):Promise<File[]>{
        return this.fileRepo.find({where:{ id: In(ids) }  })
    }
}