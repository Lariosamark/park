import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Import your Firebase auth module
import { useNavigate } from "react-router-dom"; // For navigating back to Login page

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email); // Send reset password email
      setMessage("Password reset email sent! Please check your inbox.");
      setError(""); // Clear any previous error
    } catch (error) {
      setMessage(""); // Clear success message
      setError(error.message); // Show error message if something goes wrong
    }
  };

  return (
    <main className="h-screen w-full flex">
      <section className="flex-1 flex items-center justify-center">
        <img src="/logo.png" alt="logo" />
      </section>
      <section className="bg-red-950 w-[500px] flex items-center flex-col justify-center">
        <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
        <form onSubmit={handleResetPassword} className="flex flex-col">
          <label htmlFor="email" className="text-white/70 text-sm">
            Enter your email to reset your password
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-1 rounded-md mb-2"
            placeholder="Email"
          />
          <button
            type="submit"
            className="p-1 bg-red-700 rounded-md mt-4 text-white"
          >
            Send Reset Link
          </button>
          {message && <p className="text-green-500 mt-2">{message}</p>}
          {error && <p className="text-red-700 mt-2">{error}</p>}
        </form>
        {/* Login Again Button */}
        <button
          onClick={() => navigate("/login")} // Navigate back to the login page
          className="p-2 bg-blue-600 rounded-md mt-4 text-white"
        >
          Login Again
        </button>
      </section>
    </main>
  );
}
