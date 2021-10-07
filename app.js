// FOR TESTING PURPOSE ONLY!!!
let express = require('express');
let app = express();

app.use(express.static('public'));

app.listen(3000, () => console.log(`Service working, port 3000`));
