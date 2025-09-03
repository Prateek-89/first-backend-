const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }








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


