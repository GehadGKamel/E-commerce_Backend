const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config({ path: 'config.env' });

const app = express();

if (process.env.NODE_ENV == 'development') {
   app.use(morgan('dev'));
   console.log(`mode: ${process.env.NODE_ENV}`);
}


app.get('/', (req, res) => {
   res.send('our API V3');
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
   console.log(`App running on port ${PORT}`);
}) 