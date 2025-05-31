const nodemailer = require("nodemailer");
const User = require("../model/user");

const generateDiscountCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const htmlTemplate = (code) => {
  return `
    <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              color: #333;
            }
            .container {
              width: 98%;
              padding: 2%;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
        h1 {
              color: #4CAF50;
              font-size: 20px;
            }
            .discount-code {
              display: block;
              text-align: center;
              font-size: 36px;
              font-weight: bold;
              color: #ffffff;
              background-color: #FF5733;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              text-transform: uppercase;
            }
            .footer {
              font-size: 12px;
              text-align: center;
              color: #888;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Congratulations on Subscribing!</h1>
            <p>Thank you for subscribing to our service. We're excited to offer you an exclusive discount!</p>
            <p>Here is your <strong>6-digit discount code</strong>:</p>
            <div class="discount-code">
              ${code}
            </div>
            <p>Use this code at checkout to save on your next purchase!</p>
            <p class="footer">This code is valid for a limited time only. Terms and conditions apply.</p>
          </div>
        </body>
      </html>
      `;
};

const subscribe = async (req, res) => {
  const { email } = req.body;
  const discountCode = generateDiscountCode();

  if (!email) {
    return res.status(400).send({ message: "Email is required." });
  }

  let user = await User.findOne({ email: email });

  if (user.isSubcribed) {
    return res.status(400).json({ message: "User already subscribed" });
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        isSubcribed: true,
        discountCode: discountCode,
      },
    },
    { new: true } // Return the updated document
  );

  const emoji = "\u{1F389}";
  let html = htmlTemplate(discountCode);
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: `Your 6-digit Discount code ${emoji}`,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .send({ message: "Discount code sent!", code: discountCode });
  } catch (err) {
    console.log("Error in subcribe mail::", err);
    res.status(500).send({ message: "Error sending email" });
  }
};

module.exports = subscribe;
