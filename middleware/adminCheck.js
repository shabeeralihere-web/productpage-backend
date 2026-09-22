import HttpError from "../helpers/httpError.js"

   const adminCheck = (req,res,next)=>{
     if(req.userData.userRole !== "admin"){
        return next(new HttpError("Access Denied.Admin only",403))
     }
     next()
   }

   export default adminCheck;