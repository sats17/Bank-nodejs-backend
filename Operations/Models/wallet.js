import mongoose, { mongo } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const walletSchema = new mongoose.Schema({
    userIFSC : {type:String,required:true,unique:true},
    balance : {type:Number,default : 0}
})

walletSchema.plugin(uniqueValidator)

const bankWallet = mongoose.model("bankWallet",walletSchema,"bankWallet")

export default bankWallet;