import bankUser from "../Models/user";
import bankWallet from "../Models/wallet";
import HttpCodes from "../utils/httpCodes";


export default class BankUserController{
    
        model = bankUser
    

       insert = (req,res) => {

        function errorHandler(err,errType){

            if(err){
                return res.status(errType.CODE).json({
                    message : errType.MESSAGE,
                    dev : err 
                })
            }
        
        }

        if(!req.body){
            errorHandler(new Error("Please fill all fields"),HttpCodes.BAD_REQUEST)
        }
        else{

            let body = new bankUser(req.body);

            body
                .save()
                .then(doc => {
                    res.status(HttpCodes.OK.CODE).json(
                        doc
                    )
                })
                .catch(err => {
                    errorHandler(err,HttpCodes.SERVER_ERROR);
                })
            }
        
    }
    
}
