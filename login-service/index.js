const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Login DB connected'))
  .catch(err => console.error(err));

const Student = mongoose.model('Student', new mongoose.Schema({
  student_id: String,
  student_name: String,
  student_mobile: String,
  student_email: String,
  student_password: String
}), 'students');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

app.post('/login', async (req, res) => {
  try {
    const { student_email, student_password } = req.body;
    if (!student_email || !student_password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const s = await Student.findOne({ student_email });
    if (!s) return res.status(401).json({ error: 'Invalid email or password' });

    const ok = await bcrypt.compare(student_password, s.student_password);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { student_id: s.student_id, student_email: s.student_email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      message: 'Login successful',
      student_id: s.student_id,
      student_name: s.student_name,
      token
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3002, () => console.log('Login service on 3002'));
