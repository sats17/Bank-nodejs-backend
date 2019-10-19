import operationRouter from "./Operations/routes";


export default function setRoutes (app) { 

  app.use('/api',operationRouter);

} 


