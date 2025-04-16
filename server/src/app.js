const exppress = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = exppress();


app.use(cors({
  origin: "http://localhost:3000", // Only allow your frontend origin
  credentials: true, // This allows cookies to be sent
}));

// app.use(cors({
//   origin:['*','http://localhost:3000'],
//   credentials:true
// }))

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

