import mongoose from "mongoose";
import bankWallet from "./wallet";
import uniqueValidator from "mongoose-unique-validator";


const userSchema = new mongoose.Schema({
    firstName : {type : String,required : true},
    lastName : {type : String,required : true},
    userIFSC : {type : String,unique : true},
    accountPassword : {type : String,required : true},
    mobileNumber : {type : String,unique : true,required : true}
})

userSchema.plugin(uniqueValidator);

userSchema.pre("save", async function(){
    await userIFSCGenerator(this);
    await createWallet(this);
})

function userIFSCGenerator(schema){
    
    var chars = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var nums = "";
    var numbers = "1234567890"
    let i = 0;

    for(i ; i <= 4 ;i++){
        chars +=  characters.charAt(Math.floor(Math.random() * characters.length))
        nums +=  numbers.charAt(Math.floor(Math.random() * numbers.length))
    }

    schema.userIFSC = chars+nums;


}

function createWallet(schema){
    let wallet = {
        "userIFSC" : schema.userIFSC
    }
    let userWallet = new bankWallet(wallet);
    userWallet
              .save()
              .then(doc => {

            });

}



const bankUser = mongoose.model("bankUser",userSchema,"bankUser");

export default bankUser;