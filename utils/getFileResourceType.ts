 export const getResourceType = ((mimeType:string) => {
      if(mimeType.startsWith('image/')) return 'image'
      if(mimeType.startsWith('video/')) return 'video'
      if(mimeType.startsWith('audio/')) return 'audio'
      if(mimeType.startsWith('text/')) return 'text'
      if(mimeType === 'application/pdf' || mimeType.includes('word') || mimeType.includes('excel') || mimeType.includes
      ('presentation') ) return 'document'

      return 'file'
  })

