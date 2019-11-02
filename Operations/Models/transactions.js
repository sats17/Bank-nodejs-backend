import mongoose from "mongoose";
import transactionTypes from "../utils/transactionTypes"

const transactionsSchema = mongoose.Schema({
    accountNumber : {type:String},
    date : Date,
    transactionType : {
        type:String,
        enum:[
            transactionTypes.DEPOSIT,
            transactionTypes.WITHDRAW,
            transactionTypes.FUNDTRANSFER
        ]
     },
    amount : {type:Number},
    toAccountNumber : {type:String}
})

const userTransactions = mongoose.model("userTransactions",transactionsSchema,"userTransactions");

export default userTransactions;