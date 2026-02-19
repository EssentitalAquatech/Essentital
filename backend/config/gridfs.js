import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import crypto from 'crypto';

let pondImageBucket;
let fishImageBucket;
let documentBucket;

export const initGridFS = () => {
  const conn = mongoose.connection;
  
  conn.once('open', () => {
    // Different buckets for different file types
    pondImageBucket = new GridFSBucket(conn.db, {
      bucketName: 'pondImages',
      chunkSizeBytes: 255 * 1024, // 255KB chunks
    });
    
    fishImageBucket = new GridFSBucket(conn.db, {
      bucketName: 'fishImages',
    });
    
    documentBucket = new GridFSBucket(conn.db, {
      bucketName: 'documents',
    });
    
    console.log('✅ GridFS initialized successfully');
    
    // Create indexes for better performance
    conn.db.collection('pondImages.files').createIndex({ 'metadata.pondId': 1 });
    conn.db.collection('pondImages.files').createIndex({ 'metadata.farmerId': 1 });
    conn.db.collection('pondImages.files').createIndex({ 'metadata.type': 1 });
    conn.db.collection('fishImages.files').createIndex({ 'metadata.pondId': 1 });
  });
};

// Get bucket based on type
export const getBucket = (type = 'pondImages') => {
  switch(type) {
    case 'pondImages':
      if (!pondImageBucket) throw new Error('GridFS not initialized');
      return pondImageBucket;
    case 'fishImages':
      if (!fishImageBucket) throw new Error('GridFS not initialized');
      return fishImageBucket;
    case 'documents':
      if (!documentBucket) throw new Error('GridFS not initialized');
      return documentBucket;
    default:
      throw new Error('Invalid bucket type');
  }
};

// Upload file to GridFS
export const uploadToGridFS = (fileBuffer, filename, metadata, bucketType = 'pondImages') => {
  return new Promise((resolve, reject) => {
    try {
      const bucket = getBucket(bucketType);
      
      // Generate unique ID for filename
      const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}_${filename}`;
      
      const uploadStream = bucket.openUploadStream(uniqueFilename, {
        metadata: {
          ...metadata,
          originalName: filename,
          uploadDate: new Date()
        },
        contentType: 'image/jpeg' // or detect from file
      });
      
      const bufferStream = require('stream').Readable.from(fileBuffer);
      bufferStream.pipe(uploadStream);
      
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Upload multiple files
export const uploadMultipleToGridFS = async (files, metadata, bucketType) => {
  const uploadPromises = files.map(file => 
    uploadToGridFS(file.buffer, file.originalname, metadata, bucketType)
  );
  return Promise.all(uploadPromises);
};

// Get file from GridFS
export const getFileFromGridFS = async (fileId, bucketType = 'pondImages') => {
  try {
    const bucket = getBucket(bucketType);
    const db = mongoose.connection.db;
    
    const files = await db.collection(`${bucketType}.files`)
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .toArray();
    
    if (!files || files.length === 0) {
      return null;
    }
    
    return files[0];
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
};

// Stream file to response
export const streamFileToResponse = async (fileId, res, bucketType = 'pondImages') => {
  try {
    const bucket = getBucket(bucketType);
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    
    downloadStream.on('error', (error) => {
      res.status(404).json({ error: 'File not found' });
    });
    
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error streaming file:', error);
    res.status(500).json({ error: 'Error streaming file' });
  }
};

// Delete file
export const deleteFromGridFS = async (fileId, bucketType = 'pondImages') => {
  try {
    const bucket = getBucket(bucketType);
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Generate URL for file
export const getFileUrl = (fileId, bucketType = 'pondImages') => {
  return `/api/images/${bucketType}/${fileId}`;
};