const express = require('express');
const { checkPermissionWithFallback } = require('./guards');

const app = express();
app.use(express.json());

app.post('/access-resource', checkPermissionWithFallback, (req, res) => {
  res.json({ message: 'Access granted to resource.' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
