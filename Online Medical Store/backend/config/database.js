const mongoose = require('mongoose');

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI, 
        /**useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Reference : {https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options}*/
        /*{useNewUrlParser: true,useUnifiedTopology:true, useCreateIndex: true}*/
        ).then(
        (data)=>{
            console.log(`Mongodb connected with server : ${data.connection.host}`);
        }
    )
    // not needed because handled in server.js as unhandledRejection error
    // .catch((err)=>{
    //     console.log(err);
    // });
}

module.exports = connectDatabase;