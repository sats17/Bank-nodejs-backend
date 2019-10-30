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


      let token = req.token;

      jwt.verify(token,process.env.SECRET_TOKEN,(err,authorizedData) => {
        if(err){
          let jsonObj = errorHandler(err,HttpCodes.FORBIDDEN)
          res.status(HttpCodes.FORBIDDEN.CODE).json(jsonObj)
        }
        else{

        if(isEmpty(req.body)){
            let jsonObj = errorHandler("Please fill all fields",HttpCodes.BAD_REQUEST)
            res.status(HttpCodes.BAD_REQUEST.CODE).json(jsonObj)
        }
        else{

            let IFSCCode = authorizedData.user;
            let amount = req.body.amount;

            this.model.find({userIFSC:IFSCCode},{balance:1})
                      .then(doc =>{
                          if(amount <= 0 || amount >=20000){
                            let jsonObj = errorHandler("Deposit must be greater than 0 and less than 20000",HttpCodes.UNPROCESSABLE_ENTITY)
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
    })

    }

    withdraw = (req,res) => {

        let token = req.token;

        jwt.verify(token,process.env.SECRET_TOKEN,(err,authorizedData) => {
          if(err){
            let jsonObj = errorHandler(err,HttpCodes.FORBIDDEN)
            res.status(HttpCodes.FORBIDDEN.CODE).json(jsonObj)
          }
          else{
            if(isEmpty(req.body)){
              let jsonObj = errorHandler("Please fill all fields",HttpCodes.BAD_REQUEST)
              res.status(HttpCodes.BAD_REQUEST.CODE).json(jsonObj)
            }
            else{
              let IFSCCode = authorizedData.user;
              let amount = req.body.amount;
  
              this.model
                  .find({userIFSC:IFSCCode},{balance:1})
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
                        this.model
                            .findOneAndUpdate({userIFSC:IFSCCode},{$inc:{balance: -amount}},{
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
        })
    }

    showBalance = (req,res) => {
        let token = req.token; //Got token from middleware .
        jwt.verify(token,process.env.SECRET_TOKEN,(err,authorizedData) =>{
          if(err){
              let jsonObj = errorHandler(err,HttpCodes.FORBIDDEN)
              res.status(HttpCodes.FORBIDDEN.CODE).json(jsonObj)
          }
          else{
            let userIFSC = authorizedData.user;
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
              }) //End of jwt callback function.
    }

    fundTransfer = (req,res) => {

      let token = req.token; //Got token from middleware .
        jwt.verify(token,process.env.SECRET_TOKEN,(err,authorizedData) =>{
          if(err){
              let jsonObj = errorHandler(err,HttpCodes.FORBIDDEN)
              res.status(HttpCodes.FORBIDDEN.CODE).json(jsonObj)
          }
          else{
            if(isEmpty(req.body)){
              let jsonObj = errorHandler("Please fill all fields",HttpCodes.BAD_REQUEST)
              res.status(HttpCodes.BAD_REQUEST.CODE).json(jsonObj)
            }
            else{
                let userIFSC = authorizedData.user;
                let anotherUserIFSC = req.body.userIFSC;
                let amount = req.body.amount;
                
                this.model
                    .findOne({userIFSC:userIFSC},{balance:1})
                    .then(doc => {
                      console.log(doc.balance)
                      if(amount <= 0 || amount >=2000){
                        let jsonObj = errorHandler("Amount must be greater than 0 and less than 2000",HttpCodes.UNPROCESSABLE_ENTITY)
                        res.status(HttpCodes.UNPROCESSABLE_ENTITY.CODE).json(jsonObj)
                      }
                      else if(doc.balance < amount){
                        let jsonObj = errorHandler("Insufficient fund.",HttpCodes.UNPROCESSABLE_ENTITY)
                        res.status(HttpCodes.UNPROCESSABLE_ENTITY.CODE).json(jsonObj)
                      }
                      else{
                        this.model
                            .findOneAndUpdate({userIFSC:anotherUserIFSC},{$inc:{balance:amount}})
                            .then(doc => {
                              if(isEmpty(doc)){
                                res.status(HttpCodes.UNAUTHORIZED.CODE).json(
                                  {  
                                    "message": HttpCodes.UNAUTHORIZED.MESSAGE
                                 }
                               )
                              }
                              else{
                                
                              let updatedBalance = doc
                              this.model
                                  .findOneAndUpdate({userIFSC:userIFSC},{$inc:{balance:-amount}})
                                  .then(doc => {
                                //    this.transactionCreator(IFSCCode,"FUNDTRANSFER",amount)
                                    res.status(HttpCodes.OK.CODE).json(
                                      updatedBalance
                                    )
                                  })
                                  .catch(err => {
                                    let jsonObj = errorHandler(err,HttpCodes.SERVER_ERROR)
                                    res.status(HttpCodes.SERVER_ERROR.CODE).json(jsonObj)
                                  })
                              }

                            })
                            .catch(doc => {
                              let jsonObj = errorHandler(err,HttpCodes.SERVER_ERROR)
                              res.status(HttpCodes.SERVER_ERROR.CODE).json(jsonObj)
                            })
                      }
                    })
               // res.send("yes api opend")
            }
          }
      })
    }
}

