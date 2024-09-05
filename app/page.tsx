import CarRentalSearch from '@/components/CarRentalSearch';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-white to-gray-100">
      <section className="text-center mt-24 mb-16 px-4">
        <h2 className="text-5xl font-bold mb-4 text-gray-800">
          Rent Your Car or Find the Perfect Ride
        </h2>
        <p className="text-xl mb-8 text-gray-60xp0">
          Peer-to-peer car rental made easy and secure
        </p>
        <button className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors shadow-lg">
          Get Started Now
        </button>
      </section>

      <section className="w-full max-w-6xl px-4 mb-16">
        <CarRentalSearch />
      </section>

      <section id="how-it-works" className="w-full max-w-6xl mb-16 px-4">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: 'List Your Car',
              description:
                'Upload photos, set your price, and choose availability',
              icon: '📸',
            },
            {
              title: 'Get Bookings',
              description: 'Approve rental requests and meet your renter',
              icon: '🤝',
            },
            {
              title: 'Earn Money',
              description: 'Get paid securely for renting out your car',
              icon: '💰',
            },
          ].map((step, index) => (
            <div
              key={index}
              className="text-center bg-white p-6 rounded-lg shadow-md"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="benefits" className="w-full max-w-6xl mb-16 px-4">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            'Extra income for car owners',
            'Affordable rentals for drivers',
            'Wide variety of vehicles',
            'Flexible rental periods',
            'Insurance coverage included',
            '24/7 customer support',
          ].map((benefit, index) => (
            <div
              key={index}
              className="flex items-center bg-white p-4 rounded-lg shadow-md"
            >
              <div className="text-green-500 mr-4">✓</div>
              <p className="text-lg text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="w-full max-w-6xl mb-16 px-4">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: 'John D.',
              quote:
                "RentMyCar has been a game-changer for me. I've made over $1000 in just two months!",
            },
            {
              name: 'Sarah M.',
              quote:
                "I love the variety of cars available. It's perfect for trying out different vehicles before buying.",
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <p className="text-gray-800 font-semibold">
                - {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-6xl mb-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Ready to Get Started?
        </h2>
        <p className="text-xl mb-8 text-gray-600">
          Join thousands of happy car owners and renters today!
        </p>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
          Sign Up Now
        </button>
      </section>

      <footer className="w-full text-center py-8 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Company</h3>
              <ul>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Support</h3>
              <ul>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Safety
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Cancellation Options
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <p>&copy; 2024 RentMyCar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
