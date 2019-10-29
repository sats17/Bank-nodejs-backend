import express from "express";
import BankUserController from "./Controllers/user";
import BankWalletController from "./Controllers/wallet"

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
      .post(bankWalletCtrl.deposit);     

router
      .route("/wallet/withdraw")
      .post(bankWalletCtrl.withdraw);

router
      .route("/wallet/showbalance/:id")
      .get(bankWalletCtrl.showBalance)    

router
      .route("/bank/signin")
      .post(bankUserCtrl.login);  

export default router;