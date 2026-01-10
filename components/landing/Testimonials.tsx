"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    review:
      "Absolutely love the Royal Wing Chair! The quality is exceptional and it adds such elegance to my living room. Delivery was prompt and the team was very professional.",
    image:
      "https://ui-avatars.com/api/?name=Priya+Sharma&background=d94c25&color=fff",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    review:
      "Bought the 6-seater dining set for Diwali. The craftsmanship is outstanding! My family absolutely loves it. Worth every penny.",
    image:
      "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=d94c25&color=fff",
  },
  {
    id: 3,
    name: "Anita Desai",
    location: "Bangalore",
    rating: 5,
    review:
      "The L-shaped sofa is perfect for our home. Comfortable, stylish, and the festive discount made it even better. Highly recommend!",
    image:
      "https://ui-avatars.com/api/?name=Anita+Desai&background=d94c25&color=fff",
  },
];

export function Testimonials() {
  const [activeIndex] = useState(0);

  return (
    <section className="px-4 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <span className="mb-4 inline-block rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 dark:border-zinc-700 dark:bg-zinc-800">
          Customer Reviews
        </span>
        <h2 className="mb-4 font-serif text-3xl font-bold text-zinc-900 dark:text-white md:text-5xl">
          What Our Customers Say
        </h2>
        <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-300">
          Join thousands of happy customers who have transformed their homes
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 text-left transition-all hover:border-(--festive-gold) hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-(--festive-gold) text-(--festive-gold)"
                  />
                ))}
              </div>

              <p className="mb-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                "{testimonial.review}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-zinc-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
