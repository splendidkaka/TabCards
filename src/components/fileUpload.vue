<template>
    <div>
      <input type="file" multiple @change="handleFileSelect" />
      <button @click="startAllUploads" :disabled="uploadingCount > 0">
        开始全部上传 ({{ uploadingCount }} 进行中)
      </button>
  
      <div class="upload-list">
        <div v-for="file in files" :key="file.id" class="upload-item">
          <div class="file-info">
            <span>{{ file.name }}</span>
            <span>{{ formatSize(file.size) }}</span>
          </div>
          
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: file.progress + '%' }"></div>
            <span class="progress-text">
              {{ file.status === 'error' ? '上传失败' : file.progress + '%' }}
            </span>
          </div>
  
          <div class="status-indicator" :class="file.status"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onBeforeUnmount } from 'vue'
  
  // Worker 配置
  const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB
  const MAX_CONCURRENT = 3 // 最大并发数
  const API_URL = 'https://your-api-endpoint/upload'
  
  const files = reactive([])
  const workers = reactive(new Map())
  const uploadingCount = ref(0)
  
  let fileCounter = 0
  
  // 处理文件选择
  function handleFileSelect(e) {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: ++fileCounter,
      name: file.name,
      size: file.size,
      raw: file,
      progress: 0,
      status: 'pending'
    }))
  
    files.push(...newFiles)
  }
  
  // 开始全部上传
  async function startAllUploads() {
    const pendingFiles = files.filter(f => f.status === 'pending')
    for (const file of pendingFiles) {
      while (uploadingCount.value >= MAX_CONCURRENT) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      startSingleUpload(file)
    }
  }
  
  // 启动单个文件上传
  function startSingleUpload(file) {
    file.status = 'uploading'
    uploadingCount.value++
  
    const worker = new Worker(new URL('./upload.worker.js', import.meta.url), {
      type: 'module'
    })
  
    workers.set(file.id, worker)
  
    worker.postMessage({
      file: file.raw,
      chunkSize: CHUNK_SIZE,
      uploadUrl: API_URL,
      fileId: file.id
    })
  
    worker.onmessage = (e) => {
      switch (e.data.type) {
        case 'progress':
          file.progress = e.data.progress
          break
        case 'complete':
          handleUploadComplete(file)
          break
        case 'error':
          handleUploadError(file, e.data.error)
          break
      }
    }
  }
  
  // 处理上传完成
  function handleUploadComplete(file) {
    file.status = 'success'
    cleanupWorker(file.id)
    uploadingCount.value--
  }
  
  // 处理上传错误
  function handleUploadError(file, error) {
    console.error('Upload error:', error)
    file.status = 'error'
    cleanupWorker(file.id)
    uploadingCount.value--
  }
  
  // 清理 Worker
  function cleanupWorker(fileId) {
    const worker = workers.get(fileId)
    if (worker) {
      worker.terminate()
      workers.delete(fileId)
    }
  }
  
  // 组件卸载时清理
  onBeforeUnmount(() => {
    workers.forEach(worker => worker.terminate())
    workers.clear()
  })
  
  // 工具函数 - 格式化文件大小
  function formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }
  </script>
  
  <style scoped>
  .upload-list {
    margin-top: 20px;
  }
  
  .upload-item {
    padding: 10px;
    border: 1px solid #eee;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  
  .file-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  
  .progress-container {
    height: 20px;
    background: #f5f5f5;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
  }
  
  .progress-bar {
    height: 100%;
    background: #42b983;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #333;
    font-size: 12px;
  }
  
  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-top: 5px;
  }
  
  .status-indicator.pending {
    background: #ccc;
  }
  
  .status-indicator.uploading {
    background: #42b983;
  }
  
  .status-indicator.error {
    background: #ff4757;
  }
  
  .status-indicator.success {
    background: #42b983;
  }
  </style>