# Momentum

## Authors

[Kevin](mailto:kwei.zhang@mail.utoronto.ca)  
[Minh Chau Nguyen](mailto:chaum.nguyen@mail.utoronto.ca)  
[Megan](mailto:meganmujia.liu@mail.utoronto.ca)

## Description

This web application features an AI-powered scheduler that automatically organizes users' to-do lists, prioritizes tasks based on deadlines, preferences and personalized configurations. It also offers integration with common productivity tools and an in-app video chat feature.

## Tech stack

- Frontend: TypeScript, Vue3.js (optional: Vite), shadcn-vue
- Backend: express + gRPC
- Database: redis + MySQL
- Deployment: Google Cloud (optional: k8s nginx)

## Roadmap

### Beta features (by Nov 10)

#### Task manager

Based on the task's duration, priority and deadline (if any), the app will find an appropriate timeslot on users' calendar to schedule the task. Tasks can be recurring and should be scheduled accordingly. If another task or event with higher priority pops up, the app is able to reschedule the task and ensure it is completed on time.

#### Event manager

Users are able to create one-time or recurring events that occupy a fixed timeslot on their calendar to avoid conflicts.

#### Meeting manager

Users can create one-time or recurring meetings with selected people and selected online platform (if applicable). The app is able to suggest best timeslot for meetings based on participants' schedules and preferences.

#### Native meeting with WebRTC

Users have the option to use a native video chat through the app for meetings instead of links to other platforms.

#### Integration

Users should be able to import or sync their events from other platforms (plan for Google Calendar, Apple Calendar and Microsoft Calendar) after they login by OAuth. The app can push tasks, events and meetings created internally to other connected platforms so that users always have a complete view of their schedules on all of their platforms.

### Final features (by Dec 1)

#### Project manager

An event, task or a meeting could belong to a project. There could be multiple people inside one project and the creator would be the owner. Owner and members could invite other people by their username (or generate a link). Owners should have the highest privileges such as modify project information, remove a member, add an event/meeting to other members' calendar, etc.

#### Personalization

The app learns from user adjustment of tasks and events, such as the time spent on specific types of tasks, scheduling preferences for tasks or meetings, to make better timetables. The app is able to reorganize fragmented timeslots if possible to allow extended focus time.

Certain tasks can be supported with specific scheduling to enhance productivity and efficiency. For example, studying or reviewing for exams can use spaced repetition and the app can create and schedule tasks accordingly. Users may set up their preferred time for certain tasks, such as morning for high-concentration tasks, afternoon for collaborative tasks and evening for creative tasks.

Other quality-of-life features such as sound effect when a task is completed should be implemented.

## Challenges

- Calendar view with drag-and-drop implementation in Vue
- OAuth implementation and API integration with other platforms (Google, Microsoft, Apple)
- Video meeting implementation with WebRTC 
- gRPC backend implementation
- Integration with an AI model for scheduling and learning user preferences

