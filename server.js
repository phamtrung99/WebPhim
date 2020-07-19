const express = require('express');
const app = express();
//const app = express.Router();4

app.use('/public',express.static('public')); // Cho phép sử dụng folder tĩnh folder mới sử dụng được đường dẫn /public/movie.js trong html
// không có cái này thì sẽ k hiểu được folder tĩnh

app.get('/', async(req, res) => {
    res.sendFile(__dirname+'/Movie.html');
});

// const port = 3001;
// app.listen(port, () => console.log(`Server running on port ${port}!`));
app.listen(process.env.PORT || 8080);