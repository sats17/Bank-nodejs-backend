import express from "express";
import BankUserController from "./Controllers/user";
import BankWalletController from "./Controllers/wallet";
import checkToken from "./utils/checkToken";

const router = express.Router();

const bankUserCtrl = new BankUserController();
const bankWalletCtrl = new BankWalletController();

router.get('/hello', function (req, res) {
    res.send('Hello, World!')
  });

router
     .route("/bank/signup")
     .post(bankUserCtrl.insert);  

router
      .route("/wallet/deposit")
      .post(checkToken,bankWalletCtrl.deposit);     

router
      .route("/wallet/withdraw")
      .post(checkToken,bankWalletCtrl.withdraw);

router
      .route("/wallet/showbalance")
      .get(checkToken,bankWalletCtrl.showBalance)    

router
      .route("/wallet/fundtransfer")
      .put(checkToken,bankWalletCtrl.fundTransfer)    

router
      .route("/transactions/ministatement")
      .get(checkToken,bankWalletCtrl.miniStatement)
      
router
      .route("/bank/signin")
      .post(bankUserCtrl.login);  


export default router;