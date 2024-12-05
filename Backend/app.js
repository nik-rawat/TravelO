const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
<<<<<<< HEAD
  res.send('TravelO is running!');
=======
  res.send('Hello World of keshav');
>>>>>>> keshav
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});