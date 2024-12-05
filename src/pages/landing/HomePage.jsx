export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-red-950 text-white">
        <nav className="container mx-auto p-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold">School Parking System</h1>
          <ul className="flex space-x-4">
          <li>
              <a href="/login" className="hover:underline">
                  Login
              </a>
            </li>
            <li>
              <a href="#features" className="hover:underline">
                Features
              </a>
            </li>
            <li>
              <a href="#available-parking" className="hover:underline">
                Available Parking
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow p-5">
        <section className="hero bg-red-800 text-white text-center py-20">
          <h2 className="text-4xl font-bold">
            Welcome to the School Parking System
          </h2>
          <p className="mt-4 text-xl">
            Effortlessly manage parking requests and get your own QR code for
            easy access!
          </p>
          <a
            href="#features"
            className="mt-5 inline-block bg-green-500 text-white py-2 px-4 rounded"
          >
            Learn More
          </a>
          
        </section>

        <section id="features" className="bg-white p-6 rounded shadow-md mb-5">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>✔ User-friendly registration and permit management</li>
            <li>✔ Generate personalized QR codes for quick access</li>
            <li>✔ View available parking spaces in real-time</li>
            <li>✔ Secure storage of your parking permits</li>
          </ul>
        </section>

        <section
          id="available-parking"
          className="bg-white p-6 rounded shadow-md mb-5"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Available Parking Spaces
          </h2>
          <p>Select from the available parking spaces below:</p>
          <ul className="list-disc pl-5">
            <li>Space A1 - Available</li>
            <li>Space B2 - Available</li>
            <li>Space C3 - Occupied</li>
            <li>Space D4 - Available</li>
          </ul>
        </section>
      </main>

      <footer className="bg-red-950 text-white text-center py-4" id="contact">
        <p>&copy; 2024 School Parking System. All rights reserved.</p>
        <p>Contact us: support@schoolparkingsystem.com</p>
      </footer>
    </div>
  );
}
