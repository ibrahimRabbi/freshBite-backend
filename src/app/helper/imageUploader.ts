import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({
    cloud_name: 'dymnrefpr',
    api_key: '214554444282119',
    api_secret: 'nt7kZ5Bxs4juDmI9iIpgAMUG820'
});


export const uploadImage = async (imagePath: string, imageName: string) => {
    try {
        const declarImageDetail = {
            public_id: imageName,
            overwrite: true
        };

        const result = await cloudinary.uploader.upload(imagePath, declarImageDetail);

        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully');
            }
        });

        if (!result) {
            throw new Error('Failed to host image');
        }
        return result;

    } catch (error: any) {
        throw new Error(error.message || 'Error uploading image');
    }
};




