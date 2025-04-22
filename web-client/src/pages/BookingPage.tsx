import React, { useState, FormEvent } from 'react';
import { ChevronLeft, Clock, Calendar } from 'lucide-react';

interface Service {
  name: string;
  duration: string;
  price: string;
}

interface BookingPageProps {
  service: Service;
  onBack: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ service, onBack }) => {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    
    const availableTimes: string[] = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Handle form submission
      alert(`Booking confirmed for ${service.name} on ${selectedDate} at ${selectedTime}`);
    };
    
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white px-4 py-6 shadow-sm border-b border-slate-100">
          <div className="max-w-2xl mx-auto flex items-center">
            <button 
              onClick={onBack} 
              className="mr-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Book Appointment</h1>
          </div>
        </div>
        
        {/* Service Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-slate-200">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">{service.name}</h2>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-slate-400 mr-2" />
              <span className="text-sm text-slate-600">{service.duration}</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-indigo-600 font-medium">{service.price}</span>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <div className="max-w-2xl mx-auto w-full px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-900 font-medium mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                Select Date
              </label>
              <input 
                type="date" 
                className="w-full p-3 border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-slate-900 font-medium mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                Select Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    type="button"
                    className={`p-3 border rounded-lg text-sm transition-all ${
                      selectedTime === time 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                        : "border-slate-200 text-slate-700 hover:border-indigo-600/50"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-900 font-medium mb-2">Your Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-slate-900 font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-slate-900 font-medium mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full p-3 border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-all duration-200 hover:shadow-md"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    );
};

export default BookingPage;