import bankUser from "../Models/user";
import bankWallet from "../Models/wallet"


export default class BankUserController{
    
        model = bankUser
    

       insert = (req,res) => {
        let body = new bankUser(req.body);

        body
            .save()
            .then(doc => {
                let wallet = {
                    "userIFSC" : doc.userIFSC
                }
                let userWallet = new bankWallet(wallet);
                userWallet
                          .save()
                          .then(doc => {
                                console.log("wallet inserted")
                  });
                res.send("inserted")
            })
            .catch(err => {
                res.send(err);
            })
        
    }
    
}
