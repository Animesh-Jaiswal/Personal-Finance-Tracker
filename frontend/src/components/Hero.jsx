import { Link } from 'react-router-dom';
import bgImage from '../assets/bgImage.jpg';

export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat min-h-[calc(100vh-64px)] flex items-center justify-center text-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="fade-in-up relative z-10 text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Personal Finance Tracker
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl mb-6">
          Securely sign up, add daily expenses, set monthly budgets, filter
          your spending, and see clear reports — take control of your money
          with ease.
        </p>
        <Link
          to="/register"
          className="inline-block bg-red-700 hover:bg-red-800 px-6 py-3 rounded text-lg font-semibold"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
