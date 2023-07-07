const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');

//Routes
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');

//Connect with db
dbConnection();

//express app
const app = express();

//middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
   console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use('/api/v1/categories',categoryRoute);
app.use('/api/v1/subcategories',subCategoryRoute);
app.use('/api/v1/brands', brandRoute);

app.all('*', (req, res, next) =>{
next(new ApiError(`Can't find this route:${req.originalUrl}`,400));
})

//Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
   console.log(`App running on port ${PORT}`);
}) ;

// Handle rejections outside express
process.on('unhandledRejection', (err) => {
   console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
   server.close(() => {
      console.error('Server closed');
      process.exit(1);
   });    
});