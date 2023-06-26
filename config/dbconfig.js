const mongoose =  require('mongoose');
const dotenv =  require('dotenv');
dotenv.config;

module.exports = {
    dbconnect :() => {
        mongoose.set("strictQuery" , false);
        mongoose
        .connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
          })
        .then(() =>console.log("connected to Database"))
        .catch((err) =>{
            console.log(err)
            // new AppError(500,"Unable to connect to Database")
        })
    },
}; 