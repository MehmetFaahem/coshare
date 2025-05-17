import React from "react";
import { Link } from "react-router-dom";
import { Users, Clock, MapPin, DollarSign } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../contexts/AuthContext";
import BannerImage from "../../public/banner_image.png";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Share Your Rickshaw, <br />
                  <span className="text-emerald-300">Save Your Money</span>
                </h1>
                <p className="text-xl mb-8 text-emerald-100">
                  Connect with other passengers going the same way. Split fares,
                  reduce traffic, and make new friends.
                </p>
                <div className="flex flex-wrap gap-4">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/register"
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-md font-medium transition-colors text-center"
                      >
                        Sign up for free
                      </Link>
                      <Link
                        to="/login"
                        className="px-6 py-3 bg-white text-emerald-700 hover:bg-emerald-50 rounded-md font-medium transition-colors text-center"
                      >
                        Login
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/rides"
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-md font-medium transition-colors text-center"
                      >
                        Find a Ride
                      </Link>
                      <Link
                        to="/create-ride"
                        className="px-6 py-3 bg-white text-emerald-700 hover:bg-emerald-50 rounded-md font-medium transition-colors text-center"
                      >
                        Create a Ride
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img
                  src={BannerImage}
                  alt="Rickshaw ride sharing"
                  className="max-w-full h-auto"
                  style={{ maxHeight: "450px" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Sohojatra makes it easy to find co-passengers and share rides in
                just a few simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Enter Your Route
                </h3>
                <p className="text-gray-600">
                  Specify your starting point and destination on the interactive
                  map.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Match With Others
                </h3>
                <p className="text-gray-600">
                  Find passengers heading to the same destination or create your
                  own ride.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Split the Cost
                </h3>
                <p className="text-gray-600">
                  Meet up, hire a rickshaw together, and share the fare among
                  all passengers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Why Share a Rickshaw?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Sharing rickshaws offers several benefits beyond just splitting
                the fare.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Save Money
                  </h3>
                  <p className="text-gray-600">
                    Split the fare between 2-5 passengers and save up to 80% on
                    your transportation costs. Regular commuters can save
                    thousands each month.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Save Time
                  </h3>
                  <p className="text-gray-600">
                    No more waiting for multiple rickshaws during peak hours.
                    Form groups faster and reach your destination without
                    delays.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-green-600"
                    >
                      <path d="M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1H2z"></path>
                      <path d="M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1H14z"></path>
                      <path d="M12 7V2"></path>
                      <path d="M4.2 10.2 2.5 7.5l1.7-2.7"></path>
                      <path d="m21.5 7.5-1.7-2.7 1.7-2.8"></path>
                      <path d="M10.1 7.1 12 10l1.9-2.9"></path>
                      <path d="M2 14h20"></path>
                      <path d="M5 18h14"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Eco-Friendly
                  </h3>
                  <p className="text-gray-600">
                    Reduce the number of vehicles on the road, lower emissions,
                    and contribute to a cleaner, greener environment.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Social Connections
                  </h3>
                  <p className="text-gray-600">
                    Meet new people who commute along your route. Build
                    connections and make your daily travels more enjoyable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Thousands of commuters are already saving money and time with
                Sohojatra.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4 relative">
                    <img
                      src="https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png"
                      alt="User Avatar"
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Aman</h4>
                    <p className="text-gray-500">Student</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I save almost 2000 Taka every month by sharing rickshaws to
                  college. The app is super easy to use and I've made some good
                  friends too!"
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4 relative">
                    <img
                      src="https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png"
                      alt="User Avatar"
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Anika</h4>
                    <p className="text-gray-500">Office Worker</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "As a woman, safety is my priority. This app helps me find
                  other women going to the same office complex. It's economical
                  and safe!"
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4 relative">
                    <img
                      src="https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_1280.png"
                      alt="User Avatar"
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Ashik</h4>
                    <p className="text-gray-500">IT Professional</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The real-time updates are fantastic! I can see when someone
                  joins my ride and plan accordingly. Saves me time and money
                  every day."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-emerald-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Save on Your Commute?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already sharing rickshaws and
              saving money.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-white text-emerald-700 hover:bg-emerald-100 rounded-md font-medium transition-colors"
                  >
                    Sign up now
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="px-6 py-3 border border-white hover:bg-emerald-600 rounded-md font-medium transition-colors"
                  >
                    Learn more
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/rides"
                    className="px-6 py-3 bg-white text-emerald-700 hover:bg-emerald-100 rounded-md font-medium transition-colors"
                  >
                    Find a Ride
                  </Link>
                  <Link
                    to="/create-ride"
                    className="px-6 py-3 border border-white hover:bg-emerald-600 rounded-md font-medium transition-colors"
                  >
                    Create a Ride
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
