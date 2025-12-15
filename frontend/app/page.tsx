import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect Position Coach
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with experienced position coaches in your area. Read reviews, 
            compare ratings, and take your athletic skills to the next level.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link 
              href="/coaches" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Coaches
            </Link>
            <Link 
              href="/register" 
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
            >
              Become a Coach
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🏈</div>
              <h3 className="text-xl font-bold mb-2">Expert Coaches</h3>
              <p className="text-gray-600">
                Find specialized position coaches with years of experience
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Verified Reviews</h3>
              <p className="text-gray-600">
                Read authentic reviews from real athletes
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">Local Search</h3>
              <p className="text-gray-600">
                Find coaches near you using our zipcode search
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
