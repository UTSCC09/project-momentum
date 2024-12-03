# Project-Momentum

## Description

This web application features an AI-powered scheduler that automatically organizes users' to-do lists, prioritizes tasks based on deadlines, preferences and personalized configurations. It also offers integration with common productivity tools and an in-app video chat feature.

## Team

Kevin Zhang [@kevin-z](https://github.com/KevinZJN)

Minh Chau Nguyen [@chaunguyenm](https://github.com/chaunguyenm)

~~Megan Liu [@megan-l](https://github.com/MeganMujiaLiu)~~

## Project Link

[Project Momentum](https://momentum-app.ca)

## Youtube Demo

[Youtube Demo](https://youtu.be/opvSXeoxpVg)

## Development

### Frontend

The frontend is developed using Vue.js in Typescript. Below is a list of libraries and how they are used to power the frontend:
- Zod: form validation
- PrimeVue: components and styling, icons (PrimeVue Icons)
- Anime.js: animated elements
- Schedule-X: calendar component
- Moment: handling datetime data
- Pinia: state management
- Vue-router: routing
- Vuedraggable: drag and drop components

Frontend is organized into groups of components including `calendar`, `kanban` and `forms`. Forms are reused throughout the application; hence, we decide to separate all the code related to forms to reduce code repetition. Components in `calendar` and `kanban` make up the two main views of the application, `Schedule` and `Tasks`, respectively.

Using the Single File Component structure of Vue, all code logic, stylings and template of each component is encapsulated into one single file.

Frontend utilizes some state management to avoid cumbersome props exchanging between parents and children, especially if the state information needs to traverse several layers. To do this, we use Pinia to manage global state, including user information, calendar information, and WebSocket functionalities.

### Backend

The backend mainly uses TRPC API through Express in Typescript and Redis over MYSQL. The application is using JsonWebToken for authorization, the backend will use redis to cache the token that logged out to prevent users from using the same token to re-login. The database is using sequelize on MYSQL which better handles errors and prevents SQL related attacks. The view of the calendar will be cached in redis so the next time a user visits the same time period we will save a database read, the cache will be destroyed when there are some updates on the view. We’ve also provided integration with google using their oauth2 so users can add events from their google calendar. Moreover, we’ve implemented AI functionalities such as NPL and automatically created events to finish the tasks that fit your calendar.

## Deployment

Our application is deployed using Docker, with Nginx and Let’s Encrypt Certbot configured on a virtual machine hosted on Google Cloud Platform. Nginx serves as a reverse proxy, handling various protocols such as tRPC and WebSocket over secure HTTPS connections. This setup ensures a robust and secure deployment environment, enabling seamless communication between the client and server while maintaining high standards of security through SSL/TLS certificates provided by Certbot.

## Challenges

### WebRTC real-time video chat

The application implements multiuser video meeting using WebRTC and WebSocket. We implement a mesh architecture with WebRTC, in which each user in a meeting will maintain `N - 1` connections with `N - 1` other participants of the meeting. We use WebSocket as the broker of information between any two users that make up two ends of a connection. The WebSocket servers maintain a number of sockets with users and relays messages between users to notify changes in media streams, devices and ICE candidates to each other.

### OAuth with Google and Integration with Google Calendar

We have implemented OAuth integration with Google, enabling users to link their Google accounts and sync their Google Calendar events with our calendar application. This feature allows users to effortlessly view and manage their Google Calendar events within our platform. While we considered extending functionality to allow writing back to Google Calendar, we decided not to do that as this would require access to sensitive personal data.

### Personalize AI integration using Redis

Whenever a user creates or updates an event, the information is stored in Redis for efficient data retrieval. When users leverage the AI feature to generate events based on their tasks, the stored data is utilized to pre-train the model, ensuring it has a clear understanding of the user's preferences and scheduling habits. This approach allows the AI to create a highly personalized schedule tailored to the user's needs, combining their existing events with optimized task management.

## Contributions

Kevin Zhang:
- Backend implementation with TRPC
- OAuth and integration with google
- Setup Database schema and Redis
- AI Integration with OpenAI
- Deployment

Minh Chau Nguyen:
- Frontend development
- WebRTC
- Frontend, database and Redis deployment

Megan Liu:
- Database schema design