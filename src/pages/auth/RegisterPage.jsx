import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../lib/auth"; // Assume you have a register function
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      await register({ firstName, lastName, email, password, contactNumber });
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <main className="h-screen w-full flex">
      <section className="flex-1 flex items-center justify-center">
        Logo
      </section>
      <section className="bg-red-950 w-[500px] flex items-center flex-col justify-center">
        <h1 className="text-2xl font-bold text-white">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="firstName" className="text-white/70 text-sm">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-1 rounded-md mb-2"
            placeholder="First Name"
          />
          <label htmlFor="lastName" className="text-white/70 text-sm">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-1 rounded-md mb-2"
            placeholder="Last Name"
          />
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
            className="p-1 rounded-md mb-2"
          />
          <label htmlFor="contactNumber" className="text-white/70 text-sm">
            Contact Number
          </label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="p-1 rounded-md mb-2"
            placeholder="Contact Number"
          />
          <button
            type="submit"
            className="p-1 bg-red-700 rounded-md mt-4 text-white"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Loading..." : "Register"}
          </button>
          {error && <p className="text-red-700">{error}</p>}
          <p className="text-white mt-4">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
