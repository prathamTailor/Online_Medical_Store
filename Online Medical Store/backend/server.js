const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Config
dotenv.config({ path: "backend/config/config.env" });

// Handling Uncaught Exception
// Put this code at above because if it was last then default js exception handler will crash server(not works).
// Error producing example: console.log(variabel); // (Where variabel is not defined.)
process.on('uncaughtException', (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due Uncaught Exception`);
    process.exit(1);
});

// connect with database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Started server at http://localhost:${process.env.PORT}.`);
});

// Unhandled Promise Rejections
// Error producing example: mongodb url not valid so server can't connect with mongodb
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});