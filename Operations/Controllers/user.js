import bankUser from "../Models/user";
import bankWallet from "../Models/wallet";
import HttpCodes from "../utils/httpCodes";
import errorHandler from "../utils/errorHandler"
import isEmpty from "lodash.isempty";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";


dotenv.config(); //configure env files 

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

    login = (req,res) => {
        let accNum = req.body.accountNumber
        let password = req.body.password

        this.model
            .find({accountNumber:accNum},{accountPassword:1})
            .then(doc => {
                if(isEmpty(doc)){
                    res.status(HttpCodes.UNAUTHORIZED.CODE).json(
                        {
                            "message" : "Account number is Wrong!"
                        }
                    )
                }
                else{
                    let hashedPassword = doc[0].accountPassword;
                    if(bcrypt.compareSync(password,hashedPassword)){

                        let payload = {
                            "user" : accNum,
                        
                        }
                        let token = jwt.sign(payload,process.env.SECRET_TOKEN,{expiresIn : 60 * 60})
                        res.status(HttpCodes.OK.CODE).json(
                            {
                                "token" : token,
                                "user" : doc
                            }
                        )
                    }
                    else{
                        res.status(HttpCodes.UNAUTHORIZED.CODE).json(
                            {
                                "message" : "Password is Wrong!"
                            }
                        )

                    }   
                }
            })
            .catch(err => {
                let errorObject = errorHandler(err,HttpCodes.SERVER_ERROR);
                res.status(HttpCodes.SERVER_ERROR.CODE).json(errorObject)
            })

    }
    
}
