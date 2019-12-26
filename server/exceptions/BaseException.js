module.exports=class BaseException {
    constructor(status=400,message={"code":0},e) {
        this.status=status;
        this.message=JSON.stringify(message)
        this.error=e;
    }
};

