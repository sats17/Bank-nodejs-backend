import bankUser from "../Models/user"
import bankWallet from "../Models/wallet"
import HttpCodes from "../utils/httpCodes";
import errorHandler from "../utils/errorHandler";
import isEmpty from "lodash.isempty";


export default class BankWalletController {
    
    model = bankWallet;

    // insert = (req,res) => {
    //     let wallet = new bankWallet(req.body);
    //     wallet 
    //           .save()
    //           .then(doc => {
    //               console.log(doc)
    //               res.send(doc);
    //           })
    //           .catch(err => {
    //               res.send(err)
    //           }
    //           )
    // }

    deposit = (req,res) => {

        if(isEmpty(req.body)){
            let jsonObj = errorHandler("Please fill all fields",HttpCodes.BAD_REQUEST)
            res.status(HttpCodes.BAD_REQUEST.CODE).json(jsonObj)
        }
        else{

            let IFSCCode = req.body.userIFSC;
            let amount = req.body.amount;

            this.model.find({userIFSC:IFSCCode},{balance:1})
                      .then(doc =>{
                          if(amount <= 0 || amount >=2000){
                            let jsonObj = errorHandler("Deposit must be greater than 0 and less than 2000",HttpCodes.UNPROCESSABLE_ENTITY)
                            res.status(HttpCodes.UNPROCESSABLE_ENTITY.CODE).json(jsonObj)
                          }
                          else if(doc[0].balance + amount > 5000){
                            let jsonObj = errorHandler("You cross the bank amount storage limit",HttpCodes.UNPROCESSABLE_ENTITY)
                            res.status(HttpCodes.UNPROCESSABLE_ENTITY.CODE).json(jsonObj)
                          }
                          else{
                            this.model.findOneAndUpdate({userIFSC:IFSCCode},{$inc:{balance: amount}},{
                                new:true,
                                upsert:true,
                                runValidators:true
                                })
                                .then(doc => {
                                    res.status(HttpCodes.OK.CODE).json(
                                        doc
                                    )
                                })
                                .catch(err => {
                                    let jsonObj = errorHandler(err,HttpCodes.SERVER_ERROR)
                                    res.status(HttpCodes.SERVER_ERROR.CODE).json(jsonObj)
                                })
                          }
                        })
                      .catch(err => {
                        let jsonObj = errorHandler(err,HttpCodes.SERVER_ERROR)
                        res.status(HttpCodes.SERVER_ERROR.CODE).json(jsonObj)
                        })
                                      
        }

    }

    withdraw = (req,res) => {

        if(isEmpty(req.body)){
            let jsonObj = errorHandler("Please fill all fields",HttpCodes.BAD_REQUEST)
            res.status(HttpCodes.BAD_REQUEST.CODE).json(jsonObj)
        }
        else{

            let IFSCCode = req.body.userIFSC;
            let amount = req.body.amount;

            this.model.find({userIFSC:IFSCCode},{balance:1})
                      .then(doc =>{
                          if(amount <= 0 || amount >=2000){
                            let jsonObj = errorHandler("Withdraw must be greater than 0 and less than 2000",HttpCodes.UNPROCESSABLE_ENTITY)
                            res.status(HttpCodes.UNPROCESSABLE_ENTITY.CODE).json(jsonObj)
                          }
                          else if(doc[0].balance < amount){
                            let jsonObj = errorHandler("Insufficient fund.",HttpCodes.UNPROCESSABLE_ENTITY)
                            res.status(HttpCodes.UNPROCESSABLE_ENTITY.CODE).json(jsonObj)
                          }
                          else{
                            this.model.findOneAndUpdate({userIFSC:IFSCCode},{$inc:{balance: -amount}},{
                                new:true,
                                upsert:true,
                                runValidators:true
                                })
                                .then(doc => {
                                    res.status(HttpCodes.OK.CODE).json(
                                        doc
                                    )
                                })
                                .catch(err => {
                                    let jsonObj = errorHandler(err,HttpCodes.SERVER_ERROR)
                                    res.status(HttpCodes.SERVER_ERROR.CODE).json(jsonObj)
                                })
                          }
                        })
                      .catch(err => {
                        let jsonObj = errorHandler(err,HttpCodes.SERVER_ERROR)
                        res.status(HttpCodes.SERVER_ERROR.CODE).json(jsonObj)
                        })
                                      
        }

    }

}