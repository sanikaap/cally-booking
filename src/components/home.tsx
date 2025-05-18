import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import CalendarView from "./calendar/CalendarView";
import BookingModal from "./booking/BookingModal";
import AppointmentsSidePanel from "./appointments/AppointmentsSidePanel";
import { Button } from "./ui/button";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  service: string;
  notes?: string;
}

const Home = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      date: new Date(),
      time: "10:00 AM",
      service: "Haircut",
      notes: "Short trim",
    },
    {
      id: "2",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: "2:30 PM",
      service: "Massage",
      notes: "Deep tissue",
    },
    {
      id: "3",
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      time: "11:00 AM",
      service: "Dental Checkup",
      notes: "Regular cleaning",
    },
  ]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      ...appointment,
      id: Math.random().toString(36).substring(2, 9),
    };
    setAppointments([...appointments, newAppointment]);
    setIsBookingModalOpen(false);
    setSelectedTimeSlot(null);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const filteredAppointments =
    activeFilter === "all"
      ? appointments
      : appointments.filter(
          (appointment) =>
            appointment.service.toLowerCase() === activeFilter.toLowerCase(),
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 p-4 md:p-8 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="h-8 w-8 text-violet-500" />
          <span>Cally Appointments</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Book and manage your service appointments
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-semibold text-gray-800">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMonth}
                className="rounded-full hover:bg-violet-50 hover:text-violet-600 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                className="rounded-full hover:bg-violet-50 hover:text-violet-600 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 p-4">
              <CalendarView
                currentDate={currentDate}
                appointments={appointments}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>

            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="md:w-1/3 border-l border-gray-100 p-4"
              >
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  {format(selectedDate, "EEEE, MMMM d")}
                </h3>
                <div className="space-y-2">
                  {[
                    "9:00 AM",
                    "10:00 AM",
                    "11:00 AM",
                    "1:00 PM",
                    "2:00 PM",
                    "3:00 PM",
                    "4:00 PM",
                  ].map((time) => {
                    const isBooked = appointments.some(
                      (apt) =>
                        format(apt.date, "yyyy-MM-dd") ===
                          format(selectedDate, "yyyy-MM-dd") &&
                        apt.time === time,
                    );

                    return (
                      <motion.div
                        key={time}
                        whileHover={{ scale: isBooked ? 1 : 1.02 }}
                        className={`p-3 rounded-lg ${
                          isBooked
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-blue-50 hover:bg-blue-100 cursor-pointer shadow-sm"
                        }`}
                        onClick={() => !isBooked && handleTimeSlotSelect(time)}
                      >
                        <div className="flex justify-between items-center">
                          <span
                            className={
                              isBooked ? "text-gray-500" : "text-blue-700"
                            }
                          >
                            {time}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              isBooked
                                ? "bg-gray-200 text-gray-600"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isBooked ? "Booked" : "Available"}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:w-80 xl:w-96"
        >
          <AppointmentsSidePanel
            appointments={filteredAppointments}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </motion.div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookingSubmit}
        selectedDate={selectedDate}
        selectedTime={selectedTimeSlot}
        onBookAppointment={handleBookingSubmit}
      />
    </div>
  );
};

export default Home;
