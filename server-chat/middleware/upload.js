const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        console.log(file)
        let ext = path.extname(file.originalname)
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

module.exports = upload