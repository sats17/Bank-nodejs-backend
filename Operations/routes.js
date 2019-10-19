import express from "express";
import BankUserController from "./Controllers/user";

const router = express.Router();

const bankUserCtrl = new BankUserController();

router.get('/hello', function (req, res) {
    res.send('Hello, World!')
  });

router
     .route("/bank/signup")
     .post(bankUserCtrl.insert);  

export default router;