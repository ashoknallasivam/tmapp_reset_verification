import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";
import { updateNewPassword, updateVerification } from "../controllers/auth_controllers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

// Home
app.get("/", (req, res) => {
  res.render("index");
});

// Email verification
app.get("/verify", async (req, res) => {
  const { userId, secret } = req.query;
  try {
    const result = await updateVerification(userId, secret);
    res.render("template", {
      title: "✅ Verification Complete",
      message: "Your email address has been verified successfully.",
    });
  } catch (e) {
    res.render("template", {
      title: "❌ Verification Failed",
      message: `⚠️ Reason : ${e.message}`,
    });
  }
});

// Password recovery
app.get("/recovery", (req, res) => {
  const { userId, secret } = req.query;
  res.render("reset_password", { userId, secret, message: "" });
});

// Password reset
app.post("/reset_password", async (req, res) => {
  const { userId, secret, password, password_confirm } = req.body;

  if (password !== password_confirm) {
    return res.render("reset_password", {
      userId,
      secret,
      message: "Passwords do not match.",
    });
  }

  if (password.length < 8) {
    return res.render("reset_password", {
      userId,
      secret,
      message: "Password must be at least 8 characters.",
    });
  }

  try {
    const result = await updateNewPassword(userId, secret, password, password_confirm);
    res.render("template", {
      title: "✅ Password Changed",
      message: "Your password was changed successfully.",
    });
  } catch (err) {
    res.render("template", {
      title: "❌ Password Reset Failed",
      message: `⚠️ Reason : ${err.message}`,
    });
  }
});

// 404
app.get("*", (req, res) => {
  res.render("template", {
    title: "❌ Error",
    message: "⚠️ Page not found",
  });
});

// Export for Vercel
export default serverless(app);
