import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DayView from "./DayView";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  service: string;
  notes?: string;
}

interface CalendarViewProps {
  appointments?: Appointment[];
  onDateSelect?: (date: Date) => void;
  onTimeSlotSelect?: (date: Date, time: string) => void;
}

const CalendarView = ({
  appointments = [],
  onDateSelect,
  onTimeSlotSelect,
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayView, setShowDayView] = useState(false);

  // Mock appointments if none provided
  const [calendarAppointments, setCalendarAppointments] =
    useState<Appointment[]>(appointments);

  useEffect(() => {
    // If no appointments provided, create some mock data
    if (appointments.length === 0) {
      const today = new Date();
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          date: today,
          time: "10:00 AM",
          service: "Haircut",
        },
        {
          id: "2",
          date: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 2,
          ),
          time: "2:30 PM",
          service: "Massage",
        },
        {
          id: "3",
          date: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 5,
          ),
          time: "11:00 AM",
          service: "Dental Checkup",
        },
      ];
      setCalendarAppointments(mockAppointments);
    } else {
      setCalendarAppointments(appointments);
    }
  }, [appointments]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return calendarAppointments.filter((appointment) =>
      isSameDay(new Date(appointment.date), date),
    );
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Handle date selection
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setShowDayView(true);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (time: string) => {
    if (selectedDate && onTimeSlotSelect) {
      onTimeSlotSelect(selectedDate, time);
    }
  };

  // Generate service type colors
  const getServiceColor = (service: string) => {
    const colors: Record<string, string> = {
      Haircut: "bg-blue-300",
      Massage: "bg-violet-300",
      "Dental Checkup": "bg-emerald-300",
      Fitness: "bg-amber-300",
      Consultation: "bg-rose-300",
    };

    return colors[service] || "bg-gray-300";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-[900px] mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-0">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-slate-500" />
                  <h2 className="text-xl font-semibold text-slate-800">
                    {format(currentDate, "MMMM yyyy")}
                  </h2>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevMonth}
                    className="rounded-full hover:bg-slate-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextMonth}
                    className="rounded-full hover:bg-slate-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-slate-500 py-2"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day, index) => {
                    const dayAppointments = getAppointmentsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isSelected = selectedDate
                      ? isSameDay(day, selectedDate)
                      : false;
                    const isTodayDate = isToday(day);

                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDateClick(day)}
                        className={`
                          relative h-24 p-1 rounded-lg cursor-pointer transition-all
                          ${isCurrentMonth ? "bg-white" : "bg-slate-50 text-slate-400"}
                          ${isSelected ? "ring-2 ring-blue-400 shadow-sm" : ""}
                          ${isTodayDate ? "bg-blue-50" : ""}
                          hover:bg-slate-50
                        `}
                      >
                        <div
                          className={`
                          flex justify-center items-center w-7 h-7 rounded-full mb-1 mx-auto
                          ${isTodayDate ? "bg-blue-500 text-white" : ""}
                          ${isSelected && !isTodayDate ? "bg-blue-100" : ""}
                        `}
                        >
                          <span className="text-sm font-medium">
                            {format(day, "d")}
                          </span>
                        </div>

                        {/* Appointment Indicators */}
                        <div className="flex flex-wrap justify-center gap-1 mt-1">
                          {dayAppointments.slice(0, 3).map((appointment, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${getServiceColor(appointment.service)}`}
                              title={`${appointment.service} at ${appointment.time}`}
                            />
                          ))}
                          {dayAppointments.length > 3 && (
                            <div className="text-xs text-slate-500 mt-1">
                              +{dayAppointments.length - 3} more
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Day View Panel */}
        {showDayView && selectedDate && (
          <motion.div
            className="w-full md:w-[350px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DayView
              date={selectedDate}
              appointments={getAppointmentsForDate(selectedDate)}
              onTimeSlotSelect={handleTimeSlotSelect}
              onClose={() => setShowDayView(false)}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
