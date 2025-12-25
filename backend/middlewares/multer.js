const multer=require('multer');

const storage=multer.diskStorage(
    {
        destination:function(req,file,cb){
            cb(null,'./public/temp')
        },
        filename:function(req,file,cb){
            const suffix=Date.now();
            cb(null,file.originalname+'-'+suffix);
        }
    }
)

const upload=multer({storage:storage});

module.exports=upload;