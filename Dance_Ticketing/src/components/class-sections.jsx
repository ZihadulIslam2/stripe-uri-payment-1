"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const classData = {
  nyc: [
    { id: 1, date: "January 15, 2024", time: "19:00 - 20:30", basePrice: 3000 },
    { id: 2, date: "January 22, 2024", time: "19:00 - 20:30", basePrice: 3000 },
    { id: 3, date: "January 29, 2024", time: "19:00 - 20:30", basePrice: 3000 },
  ],
  private: [
    { id: 4, date: "January 16, 2024", time: "By appointment", basePrice: 5000 },
    { id: 5, date: "January 23, 2024", time: "By appointment", basePrice: 5000 },
    { id: 6, date: "January 30, 2024", time: "By appointment", basePrice: 5000 },
  ],
  online: [
    { id: 7, date: "January 17, 2024", time: "20:00 - 21:30", basePrice: 2000 },
    { id: 8, date: "January 24, 2024", time: "20:00 - 21:30", basePrice: 2000 },
    { id: 9, date: "January 31, 2024", time: "20:00 - 21:30", basePrice: 2000 },
  ],
};

export function ClassSections() {
  const [activeSection, setActiveSection] = useState("nyc");
  const [ticketQuantities, setTicketQuantities] = useState({});

  const updateTicketQuantity = (id, delta) => {
    setTicketQuantities((prev) => {
      const currentQuantity = prev[id] || 1;
      const newQuantity = Math.max(1, Math.min(10, currentQuantity + delta));
      return { ...prev, [id]: newQuantity };
    });
  };

  const getTicketQuantity = (id) => ticketQuantities[id] || 1;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    // stripe payment
    const handleBookNow = async (classId) => {
      try {

        // need to know about this
        const selectedClass = classData[activeSection].find(
          (classItem) => classItem.id === classId
        )
        const quantity = getTicketQuantity(classId)
        const totalAmount = selectedClass.basePrice * quantity
      console.log("total amount____", totalAmount)

        const response = await fetch(
          'http://localhost:3000/api/payment-intent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: totalAmount,
              currency: 'usd',
            }),
          }
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        // redirect to the payment url
        if (data.url) {
          window.location.href = data.url
        } else console.error('payment url not found!')
      } catch (error) {
        console.error('error creating payment intent', error)
        alert('An error occurred while processing you payment')
      }
    }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-12">
          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            {[
              { id: 'nyc', label: 'NYC/NJ Group' },
              { id: 'private', label: 'Private' },
              { id: 'online', label: 'Online' },
              { id: 'offline', label: 'offline' },
            ].map((section) => (
              <button
                key={section.id}
                className={`text-lg py-6 border-b-2 ${
                  activeSection === section.id
                    ? 'text-pink-400 border-pink-400'
                    : 'text-white/60 border-transparent hover:text-white'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Class Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl"
            >
              <div className="grid gap-4">
                {classData[activeSection].map((classItem, index) => (
                  <motion.div
                    key={classItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      {/* edit here  */}
                      {/* Class Details */}
                      <div className="text-center md:text-left">
                        <h3 className="text-white text-lg font-medium">
                          {classItem.date}
                        </h3>
                        <p className="text-white/60">{classItem.time}</p>
                      </div>
                      {/* Ticket Quantity Control */}
                      <div className="flex items-center gap-2 bg-pink-400/20 rounded-lg p-2">
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-full text-pink-400 hover:text-pink-300 hover:bg-pink-400/30"
                          onClick={() => updateTicketQuantity(classItem.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-white font-medium min-w-[2rem] text-center">
                          {getTicketQuantity(classItem.id)}
                        </span>
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-full text-pink-400 hover:text-pink-300 hover:bg-pink-400/30"
                          onClick={() => updateTicketQuantity(classItem.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {/* Price and Booking Button */}
                      <div className="flex flex-col items-end">
                        <p className="text-pink-400 text-lg font-bold pr-5">
                          {formatPrice(
                            classItem.basePrice *
                              getTicketQuantity(classItem.id)
                          )}
                        </p>
                        <button
                          onClick={()=>handleBookNow(classItem.id)}
                          className="px-4 py-2 mt-2 bg-pink-400 hover:bg-pink-500 text-white rounded-md"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
