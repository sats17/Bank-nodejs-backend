import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {type : String,required : true},
    lastName : {type : String,required : true},
    userIFSC : {type : String},
    accountPassword : {type : String,required : true},
    mobileNumber : {type : String,required : true},
    balance : {type : Number,default : 0}
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
    //let userName = 
    schema.userIFSC = chars+nums;
}



const bankUser = mongoose.model("bankUser",userSchema,"bankUser");

export default bankUser;