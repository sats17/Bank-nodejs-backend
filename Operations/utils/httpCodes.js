export default class HttpCodes {

    static OK = {
        CODE:200,
        MESSAGE: "OK"
    } 

    static SERVER_ERROR = {
        CODE : 500,
        MESSAGE : "Something went wrong , please try again."
    }

    static BAD_REQUEST = {
        CODE: 400,
        MESSAGE: "Bad request."
    };
}