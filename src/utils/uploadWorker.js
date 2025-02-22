self.onmessage = async function(e) {
    const { file, chunkSize, uploadUrl, fileId } = e.data
    const chunks = createFileChunks(file, chunkSize)
    const totalChunks = chunks.length
    let uploaded = 0
  
    const uploadPromises = chunks.map(async (chunk, index) => {
      try {
        await uploadChunk(chunk, index, totalChunks, file.name, uploadUrl, fileId)
        uploaded++
        
        // 更新进度
        const progress = Math.round((uploaded / totalChunks) * 100)
        self.postMessage({ type: 'progress', progress })
      } catch (error) {
        self.postMessage({ type: 'error', error: error.message })
        throw error
      }
    })
  
    try {
      await Promise.all(uploadPromises)
      self.postMessage({ type: 'complete' })
    } catch (error) {
      self.postMessage({ type: 'error', error: '上传失败' })
    }
  }
  
  function createFileChunks(file, chunkSize) {
    const chunks = []
    let start = 0
    while (start < file.size) {
      chunks.push(file.slice(start, start + chunkSize))
      start += chunkSize
    }
    return chunks
  }
  
  async function uploadChunk(chunk, index, totalChunks, fileName, url, fileId) {
    const formData = new FormData()
    formData.append('file', chunk)
    formData.append('chunkIndex', index)
    formData.append('totalChunks', totalChunks)
    formData.append('fileName', fileName)
    formData.append('fileId', fileId)
  
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })
  
    if (!response.ok) {
      throw new Error(`上传失败: ${response.statusText}`)
    }
  }