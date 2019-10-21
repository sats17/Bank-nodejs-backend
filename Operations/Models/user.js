import mongoose from "mongoose";
import bankWallet from "./wallet";

const userSchema = new mongoose.Schema({
    firstName : {type : String,required : true},
    lastName : {type : String,required : true},
    userIFSC : {type : String},
    accountPassword : {type : String,required : true},
    mobileNumber : {type : String,required : true}
})

userSchema.pre("save", async function(){
    await userIFSCGenerator(this);
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

// function createWallet(schema){
//     console.log(schema)
//     let wallet = {
//         userIFSC : schema.userIFSC
//     }
//     console.log(wallet)
//     let userWallet = new bankWallet(wallet);
//     console.log(userWallet)
//     userWallet
//               .save()
//               .then(doc => {
//                   console.log("wallet inserted")
//               });

// }



const bankUser = mongoose.model("bankUser",userSchema,"bankUser");

export default bankUser;