import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import pkg from '../config/config.js'
import process from 'process'

const currentEnv = process.env.NODE_ENV || 'development'
const { r2_account_id, r2_access_key_id, r2_secret_access_key, r2_bucket_name } = pkg[currentEnv]

/**
 * Thin wrapper around Cloudflare R2 (S3-compatible object storage).
 * Used to store private files — right now, store owners' subscription payment receipts.
 * Files are never made public: callers always get a short-lived signed URL to view one.
 */
class StorageService {
    constructor() {
        this.bucket = r2_bucket_name
        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${r2_account_id}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: r2_access_key_id,
                secretAccessKey: r2_secret_access_key
            }
        })
    }

    /**
     * Uploads a file buffer to the bucket under the given key.
     * @param {string} key - Object key (path) inside the bucket, e.g. "receipts/12/169999-comprobante.jpg".
     * @param {Buffer} buffer - The file's raw bytes.
     * @param {string} contentType - The file's mime type (e.g. "image/jpeg").
     * @returns {Promise<string>} The key the file was stored under.
     */
    async uploadFile(key, buffer, contentType) {
        await this.client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType
        }))
        return key
    }

    /**
     * Generates a short-lived signed URL to privately view/download an object.
     * @param {string} key - Object key inside the bucket.
     * @param {number} [expiresIn=300] - Seconds until the URL expires (default 5 minutes).
     * @returns {Promise<string>} The signed URL.
     */
    async getSignedDownloadUrl(key, expiresIn = 300) {
        const command = new GetObjectCommand({ Bucket: this.bucket, Key: key })
        return getSignedUrl(this.client, command, { expiresIn })
    }
}

export default StorageService
