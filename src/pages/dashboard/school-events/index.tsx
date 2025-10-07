/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSchoolEvents } from "@/features/school-events/hooks/useSchoolEvents";
import { ReactElement, useEffect, useState } from "react";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import "@schedule-x/theme-shadcn/dist/index.css";
import {
  createViewMonthGrid,
} from "@schedule-x/calendar";
import { useHeader } from "@/contexts/HeaderContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "@/features/school-events/components/SchoolEventForm";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import "@schedule-x/theme-default/dist/index.css";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function SchoolEventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState<any>(null);
  const { schoolEvents, mutate, error } = useSchoolEvents({
    limit: 100,
  });
  const { setTitle } = useHeader();
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const handleEventDragUpdate = async (updatedEvent: any) => {
    try {
      // Ekstrak data yang relevan untuk dikirim ke API
      const payload = {
        title: updatedEvent.title,
        description: updatedEvent.description,
        start_date: updatedEvent.start.toString(),
        end_date: updatedEvent.end.toString(),
      };

      await apiClient.put(`/school-events/${updatedEvent.id}`, payload);
      toast.success("Jadwal acara berhasil diperbarui.");
      mutate();
    } catch (error) {
      toast.error("Gagal memperbarui jadwal acara.");
      mutate();
    }
  };

  const calendarApp = useNextCalendarApp({
    views: [createViewMonthGrid()],
    plugins: [eventsService],
    callbacks: {
      onRender: () => {
        eventsService.getAll();
      },
      onClickDate: (date) => {
        const formatDate = (date: any) => {
          return new Date(
            `${date.year}-${date.month}-${date.day}`
          ).toISOString();
        };
        const start = formatDate(date);
        setSelectedEventData({ start_date: start });
        console.log(date);
        setIsModalOpen(true);
      },
      onEventClick: (event) => {
        const formatDate = (date: any) => {
          return new Date(
            `${date.year}-${date.month}-${date.day}`
          ).toISOString();
        };
        const start = formatDate(event.start);
        const end = formatDate(event.end);

        setSelectedEventData({
          id: event.id,
          title: event.title,
          description: event.description,
          start_date: start,
          end_date: end,
        });
        setIsModalOpen(true);
      },
      onEventUpdate: handleEventDragUpdate,
    },
    theme: "shadcn",
  });

  useEffect(() => {
    setTitle("Kelola Agenda Sekolah");
  }, [setTitle]);

  useEffect(() => {
    if (schoolEvents) {
      const calendarReadyEvents = schoolEvents.map((event) => {
        const timeZone = "Asia/Jakarta";
        const hasTime = (dateString: string) =>
          dateString.includes("T") || dateString.includes(" ");

        let startTemporal;
        if (hasTime(event.start)) {
          const plainStart = Temporal.Instant.from(event.start);
          startTemporal = plainStart.toZonedDateTimeISO(timeZone);
        } else {
          startTemporal = Temporal.PlainDate.from(event.start);
        }

        let endTemporal;
        if (hasTime(event.end)) {
          const plainEnd = Temporal.Instant.from(event.end);
          endTemporal = plainEnd.toZonedDateTimeISO(timeZone);
        } else {
          endTemporal = Temporal.PlainDate.from(event.end);
        }

        return {
          ...event,
          start: startTemporal,
          end: endTemporal,
        };
      });

      eventsService.set(calendarReadyEvents);
    }
  }, [schoolEvents, eventsService]);

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    mutate();
  };

  if (error) return <div>Gagal memuat data agenda.</div>;
  if (!schoolEvents) return <div>Memuat...</div>;

  return (
    <>
      <div className="sx-react-calendar-wrapper">
        <ScheduleXCalendar calendarApp={calendarApp} />
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="flex flex-col gap-8">
          <DialogHeader>
            <DialogTitle>
              {selectedEventData?.id ? "Edit Acara" : "Buat Acara Baru"}
            </DialogTitle>
          </DialogHeader>
          {/* Render form di dalam modal hanya jika ada data yang dipilih */}
          {selectedEventData && (
            <EventForm
              initialData={selectedEventData}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

SchoolEventsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
