import bankUser from "../Models/user"
import bankWallet from "../Models/wallet"

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

    deposit = (req,res) => {
        console.log(req)
        let IFSCCode = req.body.userIFSC;
        let amount = req.body.amount;

        console.log(IFSCCode," ",amount)
       // res.send(IFSCCode)
        this.model.findOneAndUpdate({userIFSC:IFSCCode},{balance: amount},{
            new:true,
            upsert:true
        })
            .then(doc => {
                console.log(doc)
                res.send("deposited")
            })
            .catch(err => {
                console.log(err)
                res.send(err)
            })


    }

}