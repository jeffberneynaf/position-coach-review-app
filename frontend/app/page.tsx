import Link from "next/link";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { Search, MapPin, Star, Users, Award, TrendingUp, CheckCircle, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative gradient-hero text-white pt-32 pb-20 px-4 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect<br />Position Coach
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Connect with experienced position coaches in your area. Read reviews, 
              compare ratings, and take your athletic skills to the next level.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by specialization..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942]"
                    />
                  </div>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Enter zip code..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942]"
                  />
                </div>
              </div>
              <Link href="/coaches">
                <Button className="w-full mt-4" size="lg">
                  <Search size={20} />
                  Search Coaches
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center mt-12">
            <Link href="/coaches">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse All Coaches
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#f91942] hover:bg-gray-100 shadow-xl">
                Become a Coach
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The best platform to find and connect with professional position coaches
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#f91942] to-[#d01437] rounded-full flex items-center justify-center">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Expert Coaches</h3>
              <p className="text-gray-600 leading-relaxed">
                Find specialized position coaches with years of professional experience and proven track records
              </p>
            </Card>
            
            <Card hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#274abb] to-[#1e3a8f] rounded-full flex items-center justify-center">
                <Star className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Verified Reviews</h3>
              <p className="text-gray-600 leading-relaxed">
                Read authentic reviews from real athletes who have trained with these coaches
              </p>
            </Card>
            
            <Card hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#28a745] to-[#218838] rounded-full flex items-center justify-center">
                <MapPin className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Local Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find coaches near you using our powerful zipcode search with customizable radius
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#f91942] text-white rounded-full flex items-center justify-center text-3xl font-bold">
                1
              </div>
              <div className="mb-4">
                <Search className="mx-auto text-[#f91942]" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Search Coaches</h3>
              <p className="text-gray-600">
                Browse our extensive directory of position coaches and filter by location, specialization, and ratings
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#f91942] text-white rounded-full flex items-center justify-center text-3xl font-bold">
                2
              </div>
              <div className="mb-4">
                <Star className="mx-auto text-[#f91942]" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Read Reviews</h3>
              <p className="text-gray-600">
                Check out verified reviews and ratings from athletes who have worked with the coaches
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#f91942] text-white rounded-full flex items-center justify-center text-3xl font-bold">
                3
              </div>
              <div className="mb-4">
                <Users className="mx-auto text-[#f91942]" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Connect & Train</h3>
              <p className="text-gray-600">
                Contact your chosen coach and start your journey to improve your athletic performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 gradient-secondary text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl text-white/80">Expert Coaches</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-xl text-white/80">Happy Athletes</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">25K+</div>
              <div className="text-xl text-white/80">Reviews</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.8</div>
              <div className="text-xl text-white/80">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Share Your Expertise?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join our platform as a coach and connect with athletes looking to improve their skills
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#f91942] hover:bg-gray-100 shadow-xl">
                <Target size={20} />
                Register as a Coach
              </Button>
            </Link>
            <Link href="/coaches">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                <CheckCircle size={20} />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
