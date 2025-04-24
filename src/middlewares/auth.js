const adminAuth = (req, res, next) => {
    console.log("Admin auth Middleware");
   const token = "XYZ";
   const isAdminAuthorised =token === "XYZ" ;
    if(!isAdminAuthorised) {
         return res.status(401).json({message: "Not Authorised"});
    }else {
        console.log("Admin Authorised");
        next();
    }};


    const userAuth = (req, res, next) => {
        console.log("user auth Middleware");
       const token = "XYZ";
       const isAdminAuthorised =token === "XYZ" ;
        if(!isAdminAuthorised) {
             return res.status(401).json({message: "Not Authorised"});
        }else {
            console.log("user Authorised");
            next();
        }};


    module.exports = {adminAuth,userAuth}; // Export the middleware function for use in other files