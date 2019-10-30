import HttpCodes from "./httpCodes";
import errorHandler from "./errorHandler";
export default function checkToken(req,res,next){
      
          let authHeader = req.headers.authorization
    
          if(typeof authHeader == 'undefined'){
            let jsonObj = errorHandler("No token found",HttpCodes.FORBIDDEN)
            res.status(HttpCodes.FORBIDDEN.CODE).json(jsonObj)
          }
          else{
            let bearer = authHeader.split(' ')
            let token = bearer[1]
            req.token = token
            next() 
    }
}      
    