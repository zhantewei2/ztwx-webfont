const BaseException=require("./BaseException");

exports.DeleteFileException=class extends BaseException{
    constructor(e){
        super(400,{code:101},e)
    }
};
exports.FileNotFoundException=class extends BaseException{
    constructor(e){
        super(400,{code:102},e)
    }
};
