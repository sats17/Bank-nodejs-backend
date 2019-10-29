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

    static UNPROCESSABLE_ENTITY = {
        CODE: 422,
        MESSAGE: "Deposit failed , please enter valid amount."
    };

    static UNAUTHORIZED = {
        CODE: 401,
        MESSAGE: "Wrong USERIFSC/Password. Please try again."
    };

    static FORBIDDEN = {
        CODE: 403,
        MESSAGE: "Access forbidden."
    };
}