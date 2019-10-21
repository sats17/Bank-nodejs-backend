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

        let IFSCCode = req.userIFSC;
        let amount = req.amount;

        this.bankWallet.findOneAndUpdate({userIFSC:IFSCCode},{balance:balance + amount},{
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