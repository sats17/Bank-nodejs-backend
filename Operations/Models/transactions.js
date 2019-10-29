import mongoose from "mongoose";
import transactionTypes from "../utils/transactionTypes"

const transactionsSchema = mongoose.Schema({
    userIFSC : {type:String},
    date : Date,
    transactionType : {
        type:String,
        enum:[
            transactionTypes.DEPOSIT,
            transactionTypes.WITHDRAW,
            transactionTypes.FUNDTRANSFER
        ]
     },
    amount : {type:Number}
})

const userTransactions = mongoose.model("userTransactions",transactionsSchema,"userTransactions");

export default userTransactions;