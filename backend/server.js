const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const app = express();

// ✅ MIDDLEWARE (order matters)
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./modules/users/users.routes'));

app.use(express.urlencoded({ extended: true }));

// ✅ ROUTES
const routes = require('./routes');
app.use('/api', routes);

// ✅ START SERVER
// app.listen(3000, () => {
//   console.log('🚀 SmartPOS backend running on http://localhost:3000');
// });

app.listen(3001, '127.0.0.1', () => {
  console.log('Backend running on http://127.0.0.1:3001');
});
