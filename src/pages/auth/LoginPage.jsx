import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../lib/auth";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // Login function from your auth lib
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main className="h-screen w-full flex">
      <section className="flex-1 flex items-center justify-center">
        <img src="/logo.png" alt="logo" />
      </section>
      <section className="bg-red-950 w-[500px] flex items-center flex-col justify-center">
        <h1 className="text-2xl font-bold text-white">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="email" className="text-white/70 text-sm">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-1 rounded-md mb-2"
            placeholder="Email"
          />
          <label htmlFor="password" className="text-white/70 text-sm">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-1 rounded-md"
          />
          <button
            type="submit"
            className="p-1 bg-red-700 rounded-md mt-4 text-white"
          >
            Login
          </button>
          {error && <p className="text-red-700">{error}</p>}
          <Link to="/ForgotPasswordPage" className="text-white mt-4">
            Forgot Password?
          </Link>
          <p className="text-white">
            Don't have an account? <Link to="/Register">Sign Up</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
