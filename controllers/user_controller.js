
const User = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');

function isStrongPassword(password) {
  // Define your password requirements
  const minLength = 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

  // Check if the password meets all requirements
  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasDigit &&
    hasSpecialChar
  )
}

//signup (create a new user)
module.exports.signup = async (req, res) => {

  try {
    const { username, email, password, confirm_Password } = req.body;

    if (!username || !email || !password || !confirm_Password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirm_Password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Weak password,Please your password must contain: 1.uppercase 2.lowercase 3.number 4.(the length Minimum word length 10) 5.special_character:@,#,... ' });
    }

    const user = await User.create({ username, email, password, confirm_Password });
    return res.status(201).json({ message: 'Signup successful', user });

  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Error during signup maybe email is invalid format, or Email is already taken' });
  }
};


//login user
module.exports.login = async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  try {

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password(Invalid credentials)' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.createToken({ userId: user._id });
      return res.status(200).json({ message: 'Login successful', user, token });

    } else {
      return res.status(401).json({ message: 'Invalid email or password(Invalid credentials)' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error during login' });
  }
};