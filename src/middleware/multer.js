import multer from "multer"

export const multerHost=(customValidation=[],errorMessage="invalid file type")=>{
    
    const storage = multer.diskStorage({})
      function fileFilter (req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            return cb(null, true)
        }else{
            return cb(new Error(errorMessage), false)
        }
      
      }
      
      const upload = multer({ storage,fileFilter })
      return upload
}