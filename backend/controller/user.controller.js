import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import createTokenAndSaveCookie from '../jwt/generateToken.js'
import transporter from '../config/nodemailer.config.js'
import StoreOTP from '../models/otp.model.js'

export const signup = async (req, res) => {
  try {
    let { username, name, email, password, confirmpassword, profilePicURL, withGoogle } = req.body;

    if (!withGoogle && password !== confirmpassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    if (!username || !name || !email || !profilePicURL) {
      return res.status(400).json({ message: "Please provide valid data!" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    let newUser;

    if (!withGoogle) {
      const hash = await bcrypt.hash(password, 10);

      newUser = new User({
        username,
        name,
        email,
        password: hash,
        profilePicURL,
      });
    } else {
      newUser = new User({
        username,
        name,
        email,
        profilePicURL,
        signupWithGoogle: true
      });
    }

    await newUser.save().then(() => {
      console.log("User saved successfully!");
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to AIspire',
      text: `Hi [${name}],

          Welcome to AI Spire — we're thrilled to have you on board!

          You’ve just joined a community that’s passionate about harnessing the power of AI to achieve more, think smarter, and build the future. Whether you’re here to explore, create, or innovate, we’re here to support you every step of the way.

          Here’s what you can do next:
          🔍 Explore your dashboard to get familiar with the tools.

          🎯 Set up your profile to personalize your experience.

          📘 Check out our getting started guide to make the most of AI Spire.

          If you have any questions or need help getting started, our team is always here for you — just hit reply or visit our Help Center.

          Thanks again for joining us. We’re excited to see what you’ll create!

          Warm regards,
          The AI Spire Team
          www.aispire.com | support@aispire.com`
    }

    await transporter.sendMail(mailOptions);

    if (newUser) {
      createTokenAndSaveCookie(newUser._id, res);
      res.status(201).json({
        message: "User registered successfully.",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          profilePicURL: newUser.profilePicURL,
        }
      });
    }

  } catch (err) {
    console.log("Error in signup : ", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, withGoogle } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.active) {
      return res.status(404).json({ message: "Account deleted! Can not login!" });
    }

    if (!withGoogle) {
      const compPass = await bcrypt.compare(password, user.password);

      if (!compPass) {
        return res.status(404).json({ message: "Wrong password" });
      }
    }

    createTokenAndSaveCookie(user._id, res);

    res.status(201).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicURL: user.profilePicURL
      }
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
}


export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      path: "/",
    });
    return res.status(200).json({ message: "User successfully logged out!" });
  } catch (err) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
}


export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(500).json({ message: "Please provide a valid email" });
  }

  try {
    await StoreOTP.findOneAndDelete({ email });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "AIspire Accout verification OTP",
      text: `Your OTP is ${otp}. Verify your email ID using this OTP. It is valid for 24 hours.`
    }

    const otpData = new StoreOTP({
      email,
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await otpData.save();

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP send successful" });

  } catch (err) {
    console.log("Error in sendOtp : ", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }

}


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(500).json({ message: "Please provide a valid email or OTP" });
  }

  try {

    const data = await StoreOTP.findOne({ email });

    let valid = false;

    if (!data) {
      return res.status(200).json({ message: "Email does not found!" });
    }

    if (data.verifyOtpExpireAt < Date.now()) {
      await StoreOTP.findOneAndDelete({ email });
      return res.status(200).json({ message: "Your OTP has been Expired!" });
    }

    if (otp === data.verifyOtp) {
      valid = true;
    }


    return res.status(200).json({ message: "OTP checked", valid });


  } catch (err) {
    console.log("error in verifyOtp : ", err);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }

}



















