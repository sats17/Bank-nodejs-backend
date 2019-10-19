import bankUser from "../Models/user";


export default class BankUserController{
    
        model = bankUser
    

       insert = (req,res) => {
        let body = new bankUser(req.body);

        body
            .save()
            .then(doc => {
                console.log("inserted")
                res.send("inserted")
            })
            .catch(err => {
                res.send(err);
            })
        
    }
    
}
