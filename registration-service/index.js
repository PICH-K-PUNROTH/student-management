const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Registration DB connected'))
  .catch(err => console.error(err));

const Student = mongoose.model('Student', new mongoose.Schema({
  student_id: { type: String, default: () => crypto.randomUUID(), unique: true },
  student_name: { type: String, required: true },
  student_mobile: { type: String, required: true },
  student_email: { type: String, required: true, unique: true },
  student_password: { type: String, required: true }
}), 'students');

app.post('/register', async (req, res) => {
  try {
    const { student_name, student_mobile, student_email, student_password } = req.body;
    const hashed = await bcrypt.hash(student_password, 10);
    const s = await Student.create({ student_name, student_mobile, student_email, student_password: hashed });
    res.status(201).json({ message: 'Student registered', student_id: s.student_id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('Registration service on 3001'));
