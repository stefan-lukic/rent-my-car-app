'use client';

import {
  InstallPrompt,
  PushNotificationManager,
} from '@/components/PushNotificationManager';
import SignUpButton from '@/components/SignUpButton';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'Service Worker registered with scope:',
            registration.scope
          );
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-blue-50 to-white">
      <section className="text-center mt-32 mb-16 px-4">
        <PushNotificationManager />
        <InstallPrompt />
        <h1 className="text-6xl font-extrabold mb-4 text-gray-900 leading-tight">
          Rent Your Car or{' '}
          <span className="text-blue-600">Find the Perfect Ride</span>
        </h1>
        <p className="text-xl mb-12 text-gray-600 max-w-2xl mx-auto">
          Experience hassle-free, secure peer-to-peer car rentals with our
          innovative platform
        </p>
        <Link
          href="/cars/car-list"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Get Started Now
        </Link>
      </section>

      <section id="how-it-works" className="w-full max-w-6xl mb-24 px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
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
              className="text-center bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="text-6xl mb-6">{step.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="benefits"
        className="w-full max-w-6xl mb-24 px-4 bg-blue-600 py-16 rounded-3xl"
      >
        <h2 className="text-4xl font-bold mb-12 text-center text-white">
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
              className="flex items-center bg-white bg-opacity-10 p-6 rounded-lg"
            >
              <div className="text-green-400 mr-4 text-2xl">✓</div>
              <p className="text-lg text-white font-medium">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="w-full max-w-6xl mb-24 px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              name: 'John D.',
              quote:
                "RentMyCar has been a game-changer for me. I've made over $1000 in just two months!",
              avatar: '👨🏻‍💼',
            },
            {
              name: 'Sarah M.',
              quote:
                "I love the variety of cars available. It's perfect for trying out different vehicles before buying.",
              avatar: '👩🏽‍🦱',
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">{testimonial.avatar}</div>
              <p className="text-gray-700 italic mb-4 text-lg">
                `{testimonial.quote}`
              </p>
              <p className="text-gray-900 font-bold text-xl">
                - {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-6xl mb-24 px-4 text-center">
        <h2 className="text-5xl font-bold mb-6 text-gray-900">
          Ready to Get Started?
        </h2>
        <p className="text-xl mb-12 text-gray-600 max-w-2xl mx-auto">
          Join thousands of happy car owners and renters today!
        </p>
        <SignUpButton />
      </section>

      <footer className="w-full text-center py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Company</h3>
              <ul>
                <li>
                  <Link href="/about" className="hover:text-blue-300">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Support</h3>
              <ul>
                <li>
                  <Link href="/help" className="hover:text-blue-300">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-blue-300">
                    Safety
                  </Link>
                </li>
                <li>
                  <Link href="/cancellation" className="hover:text-blue-300">
                    Cancellation Options
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul>
                <li>
                  <Link href="/terms" className="hover:text-blue-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-blue-300">
                    Privacy Policy
                  </Link>
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
