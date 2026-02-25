# **App Name**: DayFlow

## Core Features:

- Daily Task Creation: Users can add new task titles for the current day, which are then displayed under a 'Today's Tasks' section.
- Task State Management: Each task card features 'Completed' and 'Not Done' buttons. Clicking 'Completed' timestamps the task and moves it to 'Completed Today', while 'Not Done' increments a 'forwarded count' and moves the task to the next day.
- Daily Task Progression Logic: The application intelligently processes tasks each new day, carrying forward tasks marked 'Not Done' from previous days and filtering completed tasks.
- Dashboard Metrics Display: A top-level dashboard summarizes daily productivity, showing 'Total Tasks Today', 'Completed Today', and 'Pending Today' counts.
- Dynamic Completion Progress Bar: An interactive progress bar visually represents the daily completion percentage with a smooth animated fill and percentage text, updating dynamically with task status changes.
- Offline Data Persistence: All application data, including tasks, their statuses, timestamps, and forwarded counts, are automatically saved and loaded using the browser's localStorage for offline access and data retention.

## Style Guidelines:

- Color scheme: Dark. A sophisticated deep blue (#66A5E5) serves as the primary color, chosen to evoke a sense of calm and focus within a dark interface.
- Background color: A very dark, desaturated blue-gray (#16191C), providing a clean and non-distracting canvas that enhances the readability of content.
- Accent color: A vibrant light cyan (#6ECCEC), approximately 30 degrees to the left of the primary on the color wheel. This bright hue provides excellent contrast for interactive elements and highlights, suggesting clarity and progress.
- Primary font: 'Inter', a grotesque sans-serif. Its modern, neutral, and highly readable characteristics make it suitable for both headlines and body text, ensuring a clean and consistent typography across the application.
- Use clean, minimalist icons that align with the dark modern aesthetic and card-based layout, providing clear visual cues for task actions and states.
- Card-based design with distinct sections for the dashboard, 'Today's Tasks', 'Completed Today', and 'Forwarded Tasks'. Optimized for desktop viewing, offering a responsive yet desktop-first layout strategy.
- Incorporate minimal and subtle animations, particularly for the progress bar fill and transitions between task states, contributing to a smooth user experience without being distracting.