import { defineStore } from 'pinia';
import { ref } from "vue";

export const useCalendarStore = defineStore('calendar', () => {
  const events = ref([
    {
      "id": 1,
      "title": "Team Meeting",
      "description": "Monthly team meeting to discuss project updates and goals.",
      "location": "Conference Room A",
      "start": "2024-11-10 10:00",
      "end": "2024-11-10 11:00"
    },
    {
      "id": 2,
      "title": "Doctor Appointment",
      "description": "Routine check-up with Dr. Smith.",
      "location": "Health Clinic, 123 Main St.",
      "start": "2024-11-11 14:30",
      "end": "2024-11-11 15:00"
    },
    {
      "id": 3,
      "title": "Project Kickoff",
      "description": "Kickoff meeting for the new project with stakeholders.",
      "location": "Zoom",
      "start": "2024-11-12 09:00",
      "end": "2024-11-12 10:00"
    },
    {
      "id": 4,
      "title": "Workshop: Effective Communication",
      "description": "A workshop on improving communication skills.",
      "location": "Training Room B",
      "start": "2024-11-15 13:00",
      "end": "2024-11-15 15:00"
    },
    {
      "id": 5,
      "title": "Birthday Party",
      "description": "Celebrating Sarah's birthday with friends and family.",
      "location": "Home",
      "start": "2024-11-20 17:00",
      "end": "2024-11-20 21:00"
    },
    {
      "id": 6,
      "title": "Yoga Class",
      "description": "Evening yoga session to unwind and relax.",
      "location": "Yoga Studio, 456 Elm St.",
      "start": "2024-11-21 18:00",
      "end": "2024-11-21 19:00"
    },
    {
      "id": 7,
      "title": "Sales Presentation",
      "description": "Presentation of the Q4 sales strategy to the board.",
      "location": "Main Hall",
      "start": "2024-11-22 11:00",
      "end": "2024-11-22 12:30"
    },
    {
      "id": 8,
      "title": "Charity Run",
      "description": "Participating in a charity run to support local shelters.",
      "location": "City Park",
      "start": "2024-11-25 08:00",
      "end": "2024-11-25 10:00"
    }
  ]);
  const eventsService = ref(null);

  function setEventsService(newEventsService) {
    eventsService.value = newEventsService;
  }

  function addEvent(event) {
    if (eventsService) {
      eventsService.value.add(event);
    }
    else {
      console.log("No events service provided.");
    }
  }

  function setEvents(events) {
    if (eventsService) {
      eventsService.value.set(events);
    }
    else {
      console.log("No events service provided.");
    }
  }

  function updateEvent(event) {
    if (eventsService) {
      eventsService.value.update(event);
    }
    else {
      console.log("No events service provided.");
    }
  }

  return {
    events, eventsService, setEventsService, addEvent, setEvents, updateEvent,
  }
})