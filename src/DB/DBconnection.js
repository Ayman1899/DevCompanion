import mongoose from "mongoose";
export const checkDBconnection = async () => {
    await mongoose.connect(process.env.URI_ONLINE)
    .then(()=>console.log(`DB connected on URL => ${process.env.URI_ONLINE}`))
    .catch(()=>console.log(`DB failed to connect on URL => ${process.env.URI_ONLINE}`))
}