import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfettiExplosion from "react-confetti-explosion";
import { X, Check, Calendar, Clock, FileText } from "lucide-react";
import { format, isValid } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  onBookAppointment?: (appointment: {
    service: string;
    date: Date;
    time: string;
    notes: string;
  }) => void;
  onSubmit?: (appointment: {
    service: string;
    date: Date;
    time: string;
    notes: string;
  }) => void;
}

const BookingModal = ({
  isOpen = true,
  onClose = () => {},
  selectedDate = new Date(),
  selectedTime = "10:00 AM",
  onBookAppointment = () => {},
  onSubmit,
}: BookingModalProps) => {
  const [service, setService] = useState("haircut");
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  // Ensure we have a valid date
  const validDate =
    selectedDate && isValid(selectedDate) ? selectedDate : new Date();
  const validTime = selectedTime || "10:00 AM";

  const handleBookAppointment = () => {
    setIsBooking(true);

    // Simulate API call
    setTimeout(() => {
      const appointmentData = {
        service,
        date: validDate,
        time: validTime,
        notes,
      };

      // Support both callback props
      if (onSubmit) {
        onSubmit(appointmentData);
      } else {
        onBookAppointment(appointmentData);
      }

      setIsBooking(false);
      setIsSuccess(true);
      setIsExploding(true);

      // Close modal after showing success state
      setTimeout(() => {
        setIsExploding(false);
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isExploding && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <ConfettiExplosion
            force={0.8}
            duration={2000}
            particleCount={100}
            width={1600}
          />
        </div>
      )}
      <DialogContent className="bg-white/95 backdrop-blur-md border border-blue-100 shadow-lg max-w-md w-full rounded-xl p-0 overflow-hidden">
        {/* Decorative header with gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-300 via-violet-300 to-green-300" />

        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Book Appointment
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence>
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-10"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-1">
                Booking Confirmed!
              </h3>
              <p className="text-gray-500 text-center">
                Your appointment has been successfully scheduled.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 pt-2"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Date
                  </label>
                  <div className="bg-blue-50 px-4 py-3 rounded-md text-gray-800">
                    {format(validDate, "EEEE, MMMM d, yyyy")}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-violet-500" />
                    Time
                  </label>
                  <div className="bg-violet-50 px-4 py-3 rounded-md text-gray-800">
                    {validTime}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Service Type
                  </label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger className="w-full bg-white border-gray-200">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="haircut">Haircut</SelectItem>
                      <SelectItem value="massage">Massage</SelectItem>
                      <SelectItem value="dental">Dental Check-up</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="therapy">Therapy Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-500" />
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any special requests or notes here..."
                    className="resize-none bg-green-50 border-green-100"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter className="p-6 pt-2 bg-gray-50/50">
          {!isSuccess && (
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-200 hover:bg-gray-100 hover:text-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookAppointment}
                disabled={isBooking}
                className="flex-1 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white"
              >
                {isBooking ? (
                  <>
                    <span className="animate-pulse">Booking...</span>
                  </>
                ) : (
                  "Book Appointment"
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
