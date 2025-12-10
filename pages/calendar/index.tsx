import dynamic from "next/dynamic";
import dayGridPlugin from "@fullcalendar/daygrid";
import withLayoutMain from "../../libs/components/layout/LayoutHome";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});

function CalendarPage() {
  return (
    <div style={{ padding: 20 }}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: "Exam", date: "2025-01-05" },
          { title: "Meeting", date: "2025-01-10" },
        ]}
      />
    </div>
  );
}

export default withLayoutMain(CalendarPage);
