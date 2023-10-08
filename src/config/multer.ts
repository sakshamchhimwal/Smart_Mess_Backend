import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '.../public/');
        console.log(__dirname,".../public/","from multer config");
    },
    filename: function (req, file, cb) {
        let extension = file.originalname.split('.').pop();
        cb(null, String(Date.now()) + '.' + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 15 }, // Limit file size to 15MB
}).array('images', 10); // Allow up to 5 files for the 'images' field

export default upload;