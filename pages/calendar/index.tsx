import dynamic from "next/dynamic";
import { useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import withLayoutMain from "../../libs/components/layout/LayoutHome";
import { Box, Stack, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});

// 2025 한국 공휴일 데이터
const koreanHolidays2025 = [
  { title: "New Year's Day", date: "2025-01-01", color: "#ef4444" },
  { title: "Seollal (Lunar New Year)", date: "2025-01-28", color: "#ef4444" },
  { title: "Seollal Holiday", date: "2025-01-29", color: "#ef4444" },
  { title: "Seollal Holiday", date: "2025-01-30", color: "#ef4444" },
  { title: "Independence Movement Day", date: "2025-03-01", color: "#ef4444" },
  { title: "Independence Movement Day (Observed)", date: "2025-03-03", color: "#ef4444" },
  { title: "Labor Day", date: "2025-05-01", color: "#f59e0b" },
  { title: "Children's Day", date: "2025-05-05", color: "#ef4444" },
  { title: "Buddha's Birthday", date: "2025-05-05", color: "#ef4444" },
  { title: "Buddha's Birthday (Observed)", date: "2025-05-06", color: "#ef4444" },
  { title: "Presidential Election Day", date: "2025-06-03", color: "#3b82f6" },
  { title: "Memorial Day", date: "2025-06-06", color: "#6b7280" },
  { title: "Liberation Day", date: "2025-08-15", color: "#ef4444" },
  { title: "Chuseok (Mid-Autumn Festival)", date: "2025-10-06", color: "#ef4444" },
  { title: "Chuseok Holiday", date: "2025-10-07", color: "#ef4444" },
  { title: "Chuseok Holiday", date: "2025-10-08", color: "#ef4444" },
  { title: "National Foundation Day", date: "2025-10-03", color: "#ef4444" },
  { title: "Hangeul Day", date: "2025-10-09", color: "#ef4444" },
  { title: "Christmas Day", date: "2025-12-25", color: "#ef4444" },
];

// 2026 한국 공휴일 데이터
const koreanHolidays2026 = [
  { title: "New Year's Day", date: "2026-01-01", color: "#ef4444" },
  { title: "Seollal (Lunar New Year)", date: "2026-02-16", color: "#ef4444" },
  { title: "Seollal Holiday", date: "2026-02-17", color: "#ef4444" },
  { title: "Seollal Holiday", date: "2026-02-18", color: "#ef4444" },
  { title: "Independence Movement Day", date: "2026-03-01", color: "#ef4444" },
  { title: "Labor Day", date: "2026-05-01", color: "#f59e0b" },
  { title: "Children's Day", date: "2026-05-05", color: "#ef4444" },
  { title: "Buddha's Birthday", date: "2026-05-24", color: "#ef4444" },
  { title: "Memorial Day", date: "2026-06-06", color: "#6b7280" },
  { title: "Liberation Day", date: "2026-08-15", color: "#ef4444" },
  { title: "Chuseok (Mid-Autumn Festival)", date: "2026-09-24", color: "#ef4444" },
  { title: "Chuseok Holiday", date: "2026-09-25", color: "#ef4444" },
  { title: "Chuseok Holiday", date: "2026-09-26", color: "#ef4444" },
  { title: "National Foundation Day", date: "2026-10-03", color: "#ef4444" },
  { title: "Hangeul Day", date: "2026-10-09", color: "#ef4444" },
  { title: "Christmas Day", date: "2026-12-25", color: "#ef4444" },
];

function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const currentYear = new Date().getFullYear();
  
  // Combine holidays for multiple years
  const allHolidays = [...koreanHolidays2025, ...koreanHolidays2026];

  const handleEventClick = (info: any) => {
    setSelectedEvent({
      title: info.event.title,
      date: info.event.startStr,
      color: info.event.backgroundColor,
    });
  };

  const handleDateClick = (info: any) => {
    console.log("Date clicked:", info.dateStr);
  };

  return (
    <div className="calendar-page-container">
      <Stack className="calendar-header">
        <Box className="header-content">
          <Box className="header-left">
            <CalendarMonthIcon className="header-icon" />
            <Box>
              <Typography className="header-title">
                한국 공휴일 캘린더
              </Typography>
              <Typography className="header-subtitle">
                Korean Public Holidays Calendar {currentYear}
              </Typography>
            </Box>
          </Box>
          <Box className="holiday-legend">
            <Box className="legend-item">
              <Box className="legend-dot red" />
              <span>공휴일 (Public Holiday)</span>
            </Box>
            <Box className="legend-item">
              <Box className="legend-dot orange" />
              <span>근로자의 날 (Labor Day)</span>
            </Box>
            <Box className="legend-item">
              <Box className="legend-dot gray" />
              <span>현충일 (Memorial Day)</span>
            </Box>
          </Box>
        </Box>
      </Stack>

      <Stack className="calendar-main-content">
        <Box className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            events={allHolidays}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="auto"
            locale="ko"
            buttonText={{
              today: "오늘",
              month: "월",
              week: "주",
            }}
            dayMaxEvents={3}
            eventDisplay="block"
            displayEventTime={false}
            fixedWeekCount={false}
          />
        </Box>

        {selectedEvent && (
          <Box className="event-detail-card">
            <EventIcon className="event-icon" />
            <Box>
              <Typography className="event-title">
                {selectedEvent.title}
              </Typography>
              <Typography className="event-date">
                {new Date(selectedEvent.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </Typography>
            </Box>
          </Box>
        )}

        <Box className="holiday-info-section">
          <Typography className="info-title">
            📅 주요 공휴일 안내
          </Typography>
          <Box className="info-grid">
            <Box className="info-card">
              <Typography className="info-card-title">설날 (Seollal)</Typography>
              <Typography className="info-card-text">
                음력 새해를 기념하는 한국의 가장 중요한 명절입니다. 가족들이 모여 차례를 지내고 전통 음식을 나눕니다.
              </Typography>
            </Box>
            <Box className="info-card">
              <Typography className="info-card-title">추석 (Chuseok)</Typography>
              <Typography className="info-card-text">
                한가위라고도 불리는 추석은 풍성한 추수에 감사하는 명절입니다. 송편을 만들어 먹으며 조상께 감사를 표합니다.
              </Typography>
            </Box>
            <Box className="info-card">
              <Typography className="info-card-title">삼일절 (March 1st)</Typography>
              <Typography className="info-card-text">
                1919년 일제에 항거한 3·1 독립운동을 기념하는 국경일입니다.
              </Typography>
            </Box>
            <Box className="info-card">
              <Typography className="info-card-title">광복절 (Liberation Day)</Typography>
              <Typography className="info-card-text">
                1945년 일제로부터 해방된 것을 기념하는 날입니다.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Stack>
    </div>
  );
}

export default withLayoutMain(CalendarPage);