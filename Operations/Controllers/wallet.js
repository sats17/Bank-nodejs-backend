import bankUser from "../Models/user"
import bankWallet from "../Models/wallet"
import userTransactions from "../Models/transactions";
import HttpCodes from "../utils/httpCodes";
import errorHandler from "../utils/errorHandler";
import isEmpty from "lodash.isempty";
import transactionTypes from "../utils/transactionTypes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { type } from "os";

dotenv.config();


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

    transactionCreator = (userIFSC,transactionType,amount) => {

      let transactionObj = {
        "userIFSC" : userIFSC,
        "amount" : amount,
        "date" : new Date(),
        "transactionType" : transactionType
      }

      let transactionModel = new userTransactions(transactionObj);
      transactionModel.save()

    }

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
                          if(amount <= 0 || amount >=20000){
                            let jsonObj = errorHandler("Deposit must be greater than 0 and less than 20000",HttpCodes.UNPROCESSABLE_ENTITY)
                            res.status(HttpCodes.UNPROCESSABLE_ENTITY.CODE).json(jsonObj)
                          }
                          else if(doc[0].balance + amount > 50000){
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
                                  this.transactionCreator(IFSCCode,"DEPOSIT",amount);
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
                                    this.transactionCreator(IFSCCode,"WITHDRAW",amount)
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

    showBalance = (req,res) => {

      let authHeader = req.headers.authorization

      if(typeof authHeader == 'undefined'){
 
        let jsonObj = errorHandler("No token found",HttpCodes.FORBIDDEN)
        res.status(HttpCodes.FORBIDDEN.CODE).json(jsonObj)
      }
      else{

      let bearer = authHeader.split(' ')
      let token = bearer[1]

      jwt.verify(token,process.env.SECRET_TOKEN,(err,authorizedData) =>{
        if(err){

          let jsonObj = errorHandler(err,HttpCodes.FORBIDDEN)
          res.status(HttpCodes.FORBIDDEN.CODE).json(jsonObj)
        }
      else{
      let userIFSC = req.params.id;
      this.model
               .find({userIFSC:userIFSC},{balance:1})
               .then(doc => {
                if(isEmpty(doc)){
                  res.status(HttpCodes.UNAUTHORIZED.CODE).json(
                   {  
                     "message": HttpCodes.UNAUTHORIZED.MESSAGE
                   }
                  )  
                }
                else{
                res.status(HttpCodes.OK.CODE).json(
                  doc
                )  
               }
               })
               .catch(err => {
                let jsonObj = errorHandler(err,HttpCodes.SERVER_ERROR)
                res.status(HttpCodes.SERVER_ERROR.CODE).json(jsonObj)
               })

              }
            })
      } 
      
      
    }

    fundTransfer = (req,res) => {
      // fundTransfererIFSCCODE 
    }

}