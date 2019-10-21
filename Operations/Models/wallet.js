import mongoose, { mongo } from "mongoose";

const walletSchema = new mongoose.Schema({
    userIFSC : {type:String,required:true},
    balance : {type:Number,default : 0}
})


const bankWallet = mongoose.model("bankWallet",walletSchema,"bankWallet")

export default bankWallet;