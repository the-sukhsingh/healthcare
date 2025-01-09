import { BlobServiceClient } from '@azure/storage-blob';

// Initialize blob service client
export const getBlobServiceClient = () => {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
        throw new Error('Azure Storage connection string is not configured');
    }
    return BlobServiceClient.fromConnectionString(connectionString);
};

// Ensure container exists with public access
async function ensureContainer(containerName) {
    const blobServiceClient = getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    try {
        await containerClient.createIfNotExists({
            access:'blob'
        });
    } catch (error) {
        console.error('Error creating container:', error);
        throw new Error('Failed to initialize storage container');
    }
    return containerClient;
}

// Upload file to blob storage
export const uploadToBlob = async (file, containerName = 'healthcare') => {
    try {
        const containerClient = await ensureContainer(containerName);
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        await blockBlobClient.upload(buffer, buffer.length);
        return {
            success: true,
            imageUrl: blockBlobClient.url,
            fileName: fileName
        };
    } catch (error) {
        console.error('Error uploading to blob:', error);
        throw new Error('Failed to upload file to storage');
    }
};

// Delete file from blob storage
export const deleteFromBlob = async (fileName, containerName = 'healthcare') => {
    try {
        const blobServiceClient = getBlobServiceClient();
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        // Check if blob exists before attempting to delete
        const exists = await blockBlobClient.exists();
        if (!exists) {
            return {
                success: false,
                message: 'File does not exist in storage'
            };
        }

        await blockBlobClient.delete();
        return {
            success: true,
            message: 'File deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting from blob:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to delete file from storage'
        };
    }
};
