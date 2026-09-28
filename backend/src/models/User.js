const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },
    address: { type: String, trim: true, default: '' },
    role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },

    // Only meaningful for role: 'owner'. New owner accounts must be
    // approved by an admin before they can list a vehicle — see
    // ownerController / adminController.
    isOwnerApproved: { type: Boolean, default: false },

    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Owners of role 'user' / 'admin' don't need approval; only fresh owner
// signups start out unapproved.
userSchema.pre('validate', function setOwnerApprovalDefault(next) {
  if (this.isNew && this.role !== 'owner') {
    this.isOwnerApproved = true;
  }
  next();
});

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
