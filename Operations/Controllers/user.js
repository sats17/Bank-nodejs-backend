import bankUser from "../Models/user";
import bankWallet from "../Models/wallet";
import HttpCodes from "../utils/httpCodes";
import errorHandler from "../utils/errorHandler"
import isEmpty from "lodash.isempty";



export default class BankUserController{
    
    model = bankUser
    

    insert = (req,res) => {

        
        if(isEmpty(req.body)){
            let errorObj = errorHandler("Please fill request body.",HttpCodes.BAD_REQUEST)
            res.status(HttpCodes.BAD_REQUEST.CODE).json(errorObj)
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
                    let errorObject = errorHandler(err,HttpCodes.SERVER_ERROR);
                    res.status(HttpCodes.SERVER_ERROR.CODE).json(errorObject)
                })
            }
        
    }
    
}
