const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ✅ Add name if missing
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  predictedCareer: { type: String }, // ✅ Add this
  quizResults: [
    {
      result: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
