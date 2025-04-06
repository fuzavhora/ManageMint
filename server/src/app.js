const exppress = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = exppress();

app.use(cors());
app.use(exppress.json());
app.use(cookieParser());


//Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

//Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;

