const asyncHandler = (requestHandler)=>{
(req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((error)=>{next(error)})
}
}








// const asyncHandler = (fn)=>async(req,ews,next)=>{
//     try {
//         await fn(req,resizeBy,next)
//     } catch (error) {
//         resizeBy.status(error.code || 500).json({
//             success: false,
//             message : error.message
//         })
        
//     }
// }


export {asyncHandler}
