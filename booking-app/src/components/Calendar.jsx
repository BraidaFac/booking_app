import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';

export default function Calendar() {
  function handleDateClick(arg) {
    alert(arg.dateStr);
  }
  return (
    <div class="p-4">
      <div class="mx-auto bg-white ">
        <FullCalendar
          height={500}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={[
            {
              start: '2023-10-10',
              end: '2023-10-11',
              display: 'background',
              color: '#ff9f89',
            },
          ]}
        />
      </div>
    </div>
  );
}
