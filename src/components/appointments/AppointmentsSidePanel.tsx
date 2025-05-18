import React, { useState } from "react";
import { format } from "date-fns";
import { Search, Filter, Calendar, Clock, MapPin, User } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  service: string;
  serviceType: "haircut" | "dental" | "fitness" | "spa" | "medical";
  location?: string;
  notes?: string;
  clientName?: string;
}

const serviceColors: Record<string, string> = {
  haircut: "bg-blue-100 text-blue-800",
  dental: "bg-violet-100 text-violet-800",
  fitness: "bg-green-100 text-green-800",
  spa: "bg-amber-100 text-amber-800",
  medical: "bg-rose-100 text-rose-800",
};

const mockAppointments: Appointment[] = [
  {
    id: "1",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: "10:00 AM",
    service: "Haircut & Styling",
    serviceType: "haircut",
    location: "Style Studio",
    clientName: "Alex Johnson",
  },
  {
    id: "2",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: "2:30 PM",
    service: "Dental Checkup",
    serviceType: "dental",
    location: "Smile Dental Clinic",
    notes: "Regular 6-month checkup",
    clientName: "Morgan Smith",
  },
  {
    id: "3",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    time: "4:00 PM",
    service: "Personal Training",
    serviceType: "fitness",
    location: "FitLife Gym",
    clientName: "Jamie Wilson",
  },
  {
    id: "4",
    date: new Date(),
    time: "11:30 AM",
    service: "Swedish Massage",
    serviceType: "spa",
    location: "Tranquil Spa",
    notes: "60-minute session",
    clientName: "Taylor Reed",
  },
  {
    id: "5",
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    time: "9:15 AM",
    service: "Medical Consultation",
    serviceType: "medical",
    location: "Health Center",
    clientName: "Jordan Lee",
  },
  {
    id: "6",
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    time: "3:45 PM",
    service: "Hair Coloring",
    serviceType: "haircut",
    location: "Style Studio",
    notes: "Bringing reference photos",
    clientName: "Casey Brown",
  },
];

const AppointmentsSidePanel = ({ className = "" }: { className?: string }) => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredAppointments = appointments
    .filter((appointment) => {
      if (filter === "all") return true;
      return appointment.serviceType === filter;
    })
    .filter((appointment) => {
      if (!searchQuery) return true;
      return (
        appointment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.clientName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        appointment.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const today = new Date();
  const todayAppointments = filteredAppointments.filter(
    (appointment) =>
      format(appointment.date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
  );

  const upcomingAppointments = filteredAppointments.filter(
    (appointment) => appointment.date > today,
  );

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full ${className}`}
    >
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Appointments</h2>
        <div className="mt-4 relative">
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-200"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Filter by:</span>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => setFilter("all")}
            >
              All
            </Badge>
            <Badge
              variant={filter === "haircut" ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-500 transition-colors"
              onClick={() => setFilter("haircut")}
            >
              Haircut
            </Badge>
            <Badge
              variant={filter === "dental" ? "default" : "outline"}
              className="cursor-pointer hover:bg-violet-500 transition-colors"
              onClick={() => setFilter("dental")}
            >
              Dental
            </Badge>
            <Badge
              variant={filter === "fitness" ? "default" : "outline"}
              className="cursor-pointer hover:bg-green-500 transition-colors"
              onClick={() => setFilter("fitness")}
            >
              Fitness
            </Badge>
            <Badge
              variant={filter === "spa" ? "default" : "outline"}
              className="cursor-pointer hover:bg-amber-500 transition-colors"
              onClick={() => setFilter("spa")}
            >
              Spa
            </Badge>
            <Badge
              variant={filter === "medical" ? "default" : "outline"}
              className="cursor-pointer hover:bg-rose-500 transition-colors"
              onClick={() => setFilter("medical")}
            >
              Medical
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="flex-1 p-0">
          <ScrollArea className="h-full px-4 py-2">
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium">
                  No appointments today
                </p>
                <p className="text-gray-400 text-sm">Enjoy your free time!</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="upcoming" className="flex-1 p-0">
          <ScrollArea className="h-full px-4 py-2">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.reduce<React.ReactNode[]>(
                  (acc, appointment, index, array) => {
                    const currentDate = format(appointment.date, "yyyy-MM-dd");
                    const prevDate =
                      index > 0
                        ? format(array[index - 1].date, "yyyy-MM-dd")
                        : null;

                    if (currentDate !== prevDate) {
                      acc.push(
                        <div
                          key={`date-${currentDate}`}
                          className="sticky top-0 bg-white py-2 z-10"
                        >
                          <p className="text-sm font-medium text-gray-500">
                            {format(appointment.date, "EEEE, MMMM d")}
                          </p>
                          <Separator className="mt-1" />
                        </div>,
                      );
                    }

                    acc.push(
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />,
                    );

                    return acc;
                  },
                  [],
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium">
                  No upcoming appointments
                </p>
                <p className="text-gray-400 text-sm">Your schedule is clear!</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t border-gray-100">
        <Button className="w-full" variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          View All Appointments
        </Button>
      </div>
    </div>
  );
};

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div
              className={`w-2 self-stretch ${serviceColors[appointment.serviceType].split(" ")[0]}`}
            />
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">
                    {appointment.service}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={`mt-1 ${serviceColors[appointment.serviceType]}`}
                  >
                    {appointment.serviceType.charAt(0).toUpperCase() +
                      appointment.serviceType.slice(1)}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {appointment.time}
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                {appointment.location && (
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{appointment.location}</span>
                  </div>
                )}
                {appointment.clientName && (
                  <div className="flex items-center text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    <span>{appointment.clientName}</span>
                  </div>
                )}
                {appointment.notes && (
                  <div className="text-gray-500 italic mt-1">
                    {appointment.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AppointmentsSidePanel;
