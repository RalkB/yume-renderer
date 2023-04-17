const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const  assetsPath = path.join(__dirname, 'dist');

console.log(assetsPath);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(assetsPath));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});