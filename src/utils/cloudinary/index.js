import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.cloudinary_cloud_name, 
    api_key: process.env.cloudinary_api_key, 
    api_secret:process.env.cloudinary_api_secret
});

export default cloudinary;

export const uploadImage=async(path,folder)=>{
    const {secure_url,public_id}=await cloudinary.uploader.upload(path,{folder:`job-search-app/${folder}`});
    return {secure_url,public_id};
}
export const deletedImage=async(public_id)=>{
    await cloudinary.uploader.destroy(public_id)
}