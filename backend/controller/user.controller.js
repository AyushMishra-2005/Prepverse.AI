import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import createTokenAndSaveCookie from '../jwt/generateToken.js'
import StoreOTP from '../models/otp.model.js'
import { sendTemplateMessage } from '../utils/sendWhatsappMessage.js'
import { emailApi } from '../config/bravo.config.js'


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

    await emailApi.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "PowerNest"
      },
      to: [
        {
          email: email
        }
      ],
      subject: "Welcome to Prepverse.AI",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0; padding:0; background-color:#0D0D0D; font-family:Arial, sans-serif;">

          <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
            <tr>
              <td align="center">

                <!-- Card -->
                <table width="600" cellpadding="0" cellspacing="0" 
                  style="background:#141414; border-radius:12px; padding:30px; box-shadow:0 0 25px rgba(255,105,0,0.15);">

                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding-bottom:20px;">
                      <h1 style="margin:0; color:#FF6900; font-size:28px;">
                        Prepverse.AI 🚀
                      </h1>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="color:#FFFFFF; font-size:16px; line-height:1.6;">
                      <p style="margin:0 0 10px;">Hi <strong>${name}</strong>,</p>

                      <p style="margin:0 0 15px;">
                        Welcome to <span style="color:#FF6900; font-weight:bold;">Prepverse.AI</span> — 
                        we're thrilled to have you on board!
                      </p>

                      <p style="margin:0 0 15px; color:#CCCCCC;">
                        You’ve just joined a community that’s passionate about harnessing AI to achieve more, 
                        think smarter, and build the future. Whether you’re here to explore, create, or innovate, 
                        we’re here to support you every step of the way.
                      </p>
                    </td>
                  </tr>

                  <!-- Steps -->
                  <tr>
                    <td style="padding-top:10px; color:#CCCCCC;">
                      <p style="margin-bottom:10px;">Here’s what you can do next:</p>

                      <p style="margin:6px 0;">🔍 Explore your dashboard</p>
                      <p style="margin:6px 0;">🎯 Set up your profile</p>
                      <p style="margin:6px 0;">📘 Start interviews & quizzes</p>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td align="center" style="padding:25px 0;">
                      <a href="https://www.prepverse.com"
                        style="
                          background:linear-gradient(90deg,#FF6900,#FF8C00);
                          color:#ffffff;
                          padding:14px 30px;
                          text-decoration:none;
                          border-radius:8px;
                          font-weight:bold;
                          display:inline-block;
                          box-shadow:0 0 15px rgba(255,105,0,0.6);
                        ">
                        Get Started 🚀
                      </a>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td>
                      <hr style="border:none; border-top:1px solid #2A2A2A;">
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="text-align:center; color:#888888; font-size:13px; padding-top:10px;">
                      <p style="margin:5px 0;">
                        Need help? <span style="color:#FF6900;">support@prepverse.com</span>
                      </p>
                      <p style="margin:5px 0;">www.prepverse.com</p>
                      <p style="margin:5px 0;">© Prepverse.AI</p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
        `
    });

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
        profilePicURL: user.profilePicURL,
        mobileNumber: user.mobileNumber
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
    return res.status(400).json({ message: "Please provide a valid email" });
  }

  try {
    await StoreOTP.findOneAndDelete({ email });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const otpData = new StoreOTP({
      email,
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await otpData.save();

    await emailApi.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "Prepverse.AI"
      },
      to: [
        {
          email: email
        }
      ],
      subject: "Your OTP for Prepverse.AI Verification",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0; padding:0; background-color:#0D0D0D; font-family:Arial, sans-serif;">

          <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
            <tr>
              <td align="center">

                <!-- Card -->
                <table width="600" cellpadding="0" cellspacing="0" 
                  style="background:#141414; border-radius:12px; padding:30px; box-shadow:0 0 25px rgba(255,105,0,0.15);">

                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding-bottom:20px;">
                      <h1 style="margin:0; color:#FF6900; font-size:28px;">
                        Prepverse.AI 🔐
                      </h1>
                    </td>
                  </tr>

                  <!-- Title -->
                  <tr>
                    <td style="color:#FFFFFF; text-align:center;">
                      <h2 style="margin:0 0 10px;">Verify Your Email</h2>
                      <p style="color:#CCCCCC; margin:0 0 20px;">
                        Use the OTP below to complete your verification
                      </p>
                    </td>
                  </tr>

                  <!-- OTP Box -->
                  <tr>
                    <td align="center" style="padding:20px 0;">
                      <div style="
                        display:inline-block;
                        padding:15px 30px;
                        font-size:28px;
                        letter-spacing:4px;
                        font-weight:bold;
                        color:#FF6900;
                        border:2px solid #FF6900;
                        border-radius:10px;
                        box-shadow:0 0 15px rgba(255,105,0,0.5);
                      ">
                        ${otp}
                      </div>
                    </td>
                  </tr>

                  <!-- Info -->
                  <tr>
                    <td style="color:#CCCCCC; text-align:center; font-size:14px; line-height:1.6;">
                      <p style="margin:0 0 10px;">
                        This OTP is valid for <strong style="color:#FF6900;">24 hours</strong>.
                      </p>
                      <p style="margin:0;">
                        Do not share this code with anyone for security reasons.
                      </p>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="padding-top:25px;">
                      <hr style="border:none; border-top:1px solid #2A2A2A;">
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="text-align:center; color:#888888; font-size:13px; padding-top:10px;">
                      <p style="margin:5px 0;">
                        Need help? <span style="color:#FF6900;">support@prepverse.com</span>
                      </p>
                      <p style="margin:5px 0;">www.prepverse.com</p>
                      <p style="margin:5px 0;">© Prepverse.AI</p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
        `
    });

    return res.status(200).json({ message: "OTP sent successfully" });

  } catch (err) {
    console.log("Error in sendOtp : ", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};


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


export const updateMobile = async (req, res) => {
  const userId = req.user._id;
  const { mobileNumber } = req.body;
  try {
    if (!mobileNumber) {
      return res.status(500).json({ message: "Please provide a mobile number!" });
    }
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
      return res.status(500).json({
        message: "Please enter a valid mobile number (10digits)."
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { mobileNumber },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await sendTemplateMessage({ to: mobileNumber });

    return res.status(200).json({
      message: "Mobile number updated successfully!",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        profilePicURL: updatedUser.profilePicURL,
        mobileNumber: updatedUser.mobileNumber
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
}



export const deleteMobile = async (req, res) => {
  const userId = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { mobileNumber: "" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Mobile number Deleted!",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        profilePicURL: updatedUser.profilePicURL,
        mobileNumber: updatedUser.mobileNumber
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
}














