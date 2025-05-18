import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Clock, Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  serviceType?: string;
}

interface DayViewProps {
  selectedDate: Date;
  timeSlots?: TimeSlot[];
  onSelectTimeSlot?: (timeSlot: TimeSlot) => void;
  isOpen?: boolean;
}

const DayView = ({
  selectedDate = new Date(),
  timeSlots = [
    { id: "1", time: "09:00 AM", isAvailable: true },
    { id: "2", time: "10:00 AM", isAvailable: true },
    { id: "3", time: "11:00 AM", isAvailable: false, serviceType: "Haircut" },
    { id: "4", time: "12:00 PM", isAvailable: true },
    { id: "5", time: "01:00 PM", isAvailable: true },
    {
      id: "6",
      time: "02:00 PM",
      isAvailable: false,
      serviceType: "Dental Check",
    },
    { id: "7", time: "03:00 PM", isAvailable: true },
    { id: "8", time: "04:00 PM", isAvailable: true },
    { id: "9", time: "05:00 PM", isAvailable: false, serviceType: "Massage" },
  ],
  onSelectTimeSlot = () => {},
  isOpen = true,
}: DayViewProps) => {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  if (!isOpen) return null;

  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");

  const availableCount = timeSlots.filter((slot) => slot.isAvailable).length;
  const bookedCount = timeSlots.length - availableCount;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full max-w-[350px] bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100"
    >
      <div className="p-4 bg-gradient-to-r from-blue-50 to-violet-50 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">
          {formattedDate}
        </h2>
        <div className="flex gap-2 mt-2">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            {availableCount} Available
          </Badge>
          <Badge
            variant="outline"
            className="bg-violet-50 text-violet-600 hover:bg-violet-100"
          >
            {bookedCount} Booked
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[400px] p-4">
        <div className="space-y-3 p-1">
          {timeSlots.map((slot) => (
            <motion.div
              key={slot.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredSlot(slot.id)}
              onMouseLeave={() => setHoveredSlot(null)}
            >
              <Card
                className={`overflow-hidden transition-all duration-200 ${
                  slot.isAvailable
                    ? "border-slate-200 hover:border-blue-300 hover:shadow-md"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          slot.isAvailable
                            ? "bg-blue-100 text-blue-600"
                            : "bg-violet-100 text-violet-600"
                        }`}
                      >
                        {slot.isAvailable ? (
                          <Clock size={18} />
                        ) : (
                          <Check size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {slot.time}
                        </p>
                        {!slot.isAvailable && (
                          <p className="text-xs text-slate-500">
                            Booked: {slot.serviceType}
                          </p>
                        )}
                      </div>
                    </div>
                    {slot.isAvailable && (
                      <Button
                        size="sm"
                        variant="outline"
                        className={`transition-all duration-300 ${
                          hoveredSlot === slot.id
                            ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                            : "bg-white text-blue-500 border-blue-300"
                        }`}
                        onClick={() => onSelectTimeSlot(slot)}
                      >
                        Book
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default DayView;
