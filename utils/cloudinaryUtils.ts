 export const getResourceType = ((mimeType:string) => {
      if(mimeType.startsWith('image/')) return 'image'
      if(mimeType.startsWith('video/')) return 'video'
      return 'file'
  })

    export const getCloudinaryResourceType = ((resourceType:string)=>{
       if(resourceType == 'image') return 'image'
       if(resourceType == 'video') return 'video'
       if(resourceType == 'document') return 'raw'
       return 'raw'
  })

export const getCloudinaryFolder = ((resourceType:string) => {
         if(resourceType == 'image') return 'images'
         if(resourceType == 'video') return 'videos'
         if(resourceType == 'audio') return 'audio'
         if(resourceType == 'text') return 'text'
         if(resourceType == 'document') return 'documents'
         return 'files'
})

