import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import Ffmpeg = require('fluent-ffmpeg');
 
Ffmpeg.setFfmpegPath('C:/Users/Public/bin/ffmpeg.exe');

cloudinary.config({
    cloud_name: 'dymnrefpr',
    api_key: '214554444282119',
    api_secret: 'nt7kZ5Bxs4juDmI9iIpgAMUG820'
});

export const uploadVideo = async (videoPath: string, videoName: string) => {
    try {
        const outputPath = path.join(process.cwd(), '/src/output', `${videoName}.mp4`);

        const uploadOptions: UploadApiOptions = {
            public_id: videoName,
            overwrite: true,
            resource_type: 'video',
            quality: 'auto',
            video_codec: 'h264',
            chunk_size: 10000000,
            timeout: 60000,
        };

        return new Promise((resolve, reject) => {
            Ffmpeg(videoPath)
                .output(outputPath)
                .videoCodec('libx264')
                .audioCodec('aac')
                .videoBitrate('1500k')
                .size('1280x720')
                .on('end', async () => {
                    try {
                        const result = await cloudinary.uploader.upload(outputPath, uploadOptions);
                        
                        // Clean up the temporary files after upload
                        fs.unlink(outputPath, (err) => {
                            if (err) {
                                reject(new Error('Failed to delete output file'));
                            }
                        });

                        fs.unlink(videoPath, (err) => {
                            if (err) {
                                reject(new Error('Failed to delete video file'));
                            }
                        });

                        if (!result) {
                            reject(new Error('Failed to host video on Cloudinary'));
                        }

                        resolve(result); // Resolve the promise with the result
                    } catch (uploadError: any) {
                        reject(new Error(uploadError?.message || 'Error uploading video'));
                    }
                })
                .on('error', (err: any) => {
                    reject(new Error(err?.message || 'FFmpeg Error'));
                })
                .run();
        });

    } catch (error: any) {
        throw new Error(error.message || 'Error during video upload process');
    }
};

