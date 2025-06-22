
export const validation = (schema) => {
    return async (req,res,next) => {
        const inputData = { ...req.body, ...req.query, ...req.params }
        const result = schema.validate(inputData, { abortEarly: false })
        if(result?.error) {
            return res.status(400).json({msg:"Validation Error...", error: result?.error.details})
        }
        next();
}
}
