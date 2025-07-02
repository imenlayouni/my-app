require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lewkfd5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ Connection failed:', err));

// User Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }
    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
// Add this ABOVE your other routes
app.get('/api/test', (req, res) => {
  res.json({ message: "Server is working!" });
});

// Add this error handler BELOW your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});