const dotenv = require('dotenv');
const path = require('path');


if (process.env.NODE_ENV === 'dev') {
    console.log("asdfasd")
    dotenv.config({ path: path.join(__dirname, '../.env.dev') })
} else {
    throw new Error('process.env.NODE_ENV IS EMPTY')
}
