// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "../../lib/firebase"; // Assuming Firebase is set up here

// export default function PresidentRegisterPage() {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [contactNumber, setContactNumber] = useState("");
//   const [plateNumber, setPlateNumber] = useState("");

//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams(); // Extract the ID from the URL

//   useEffect(() => {
//     const checkDocument = async () => {
//       const docRef = doc(db, "president", id);
//       const docSnap = await getDoc(docRef);

//       if (!docSnap.exists()) {
//         setError("Invalid president registration URL.");
//       }
//     };
//     checkDocument();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !password ||
//       !contactNumber ||
//       !plateNumber
//     ) {
//       setError("Please fill in all fields.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const docRef = doc(db, "president", id);
//       await updateDoc(docRef, {
//         firstName,
//         lastName,
//         email,
//         password,
//         contactNumber,
//         plateNumber,
//       });

//       const userDocRef = doc(db, "users", id); // Create a document reference in 'users' with the given ID
//       await setDoc(userDocRef, {
//         firstName,
//         lastName,
//         email,
//         role: "President", 
//       });

//       navigate("/dashboard");
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="h-screen w-full flex">
//       <section className="flex-1 flex items-center justify-center">
//         <img src="/logo.png" alt="logo" />
//       </section>
//       <section className="bg-red-950 w-[500px] flex items-center flex-col justify-center">
//         <h1 className="text-2xl font-bold text-white">Register</h1>
//         <form onSubmit={handleSubmit} className="flex flex-col">
//           <label htmlFor="firstName" className="text-white/70 text-sm">
//             First Name
//           </label>
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             className="p-1 rounded-md mb-2"
//             placeholder="First Name"
//           />
//           <label htmlFor="lastName" className="text-white/70 text-sm">
//             Last Name
//           </label>
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             className="p-1 rounded-md mb-2"
//             placeholder="Last Name"
//           />
//           <label htmlFor="email" className="text-white/70 text-sm">
//             Email
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="p-1 rounded-md mb-2"
//             placeholder="Email"
//           />
//           <label htmlFor="password" className="text-white/70 text-sm">
//             Password
//           </label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             className="p-1 rounded-md mb-2"
//           />
//           <label htmlFor="contactNumber" className="text-white/70 text-sm">
//             Contact Number
//           </label>
//           <input
//             type="text"
//             value={contactNumber}
//             onChange={(e) => setContactNumber(e.target.value)}
//             className="p-1 rounded-md mb-2"
//             placeholder="Contact Number"
//           />
//           <label htmlFor="plateNumber" className="text-white/70 text-sm">
//             Plate Number
//           </label>
//           <input
//             type="text"
//             value={plateNumber}
//             onChange={(e) => setPlateNumber(e.target.value)}
//             className="p-1 rounded-md mb-2"
//             placeholder="Plate Number"
//           />
//           <button
//             type="submit"
//             className="p-1 bg-red-700 rounded-md mt-4 text-white"
//             disabled={loading} // Disable button when loading
//           >
//             {loading ? "Loading..." : "Register"}
//           </button>
//           {error && <p className="text-red-700">{error}</p>}
//         </form>
//       </section>
//     </main>
//   );
// }
