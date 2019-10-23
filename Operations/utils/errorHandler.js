export default function errorHandler(err,errType){
    if(err){
        return {
            message : errType.MESSAGE,
            dev : err
        }
    }
}