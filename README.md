# Cofactr Orders Dashboard

A modern AngularJS dashboard application for managing orders, built to match the design shown in the provided image.

## Features

- **Responsive Design**: Clean, modern interface with sidebar navigation
- **Orders Management**: Complete orders table with filtering and pagination
- **Status Tracking**: Filter orders by status (All, Active, Pending, Cancelled)
- **Interactive Elements**: Action buttons for each order with different states
- **Navigation**: Sidebar with multiple sections (Dashboard, Inventory, Production, Orders, Reports, etc.)
- **Notifications**: Header with message and notification badges
- **User Profile**: User profile picture in header

## Project Structure

```
angular/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js             # Angular app configuration and routing
├── package.json       # Dependencies
├── orders/
│   ├── orders.html    # Orders page template
│   └── orders.js      # Orders controller
└── README.md          # This file
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:8080`

## Technologies Used

- **AngularJS 1.8.2**: Frontend framework
- **Angular Route**: Client-side routing
- **Font Awesome**: Icons
- **CSS3**: Styling with modern features
- **HTML5**: Semantic markup

## Key Components

### Sidebar Navigation
- Company logo with green accent
- Search functionality
- Navigation menu with icons
- Active state highlighting

### Header
- Notification badges (messages: 2, notifications: 6)
- User profile picture
- Clean, minimal design

### Orders Page
- Status tabs with counts
- Action buttons (Add Order, Export, Filter)
- Data table with all order information
- Pagination controls
- Responsive design

### Order Data
The application includes sample data matching the design:
- Product items (Shirt, Notebook, Laptop, etc.)
- Item numbers, incoming quantities, categories
- Dates, quantities, prices
- Payment status and action buttons

## Customization

- **Colors**: Modify CSS variables for different color schemes
- **Data**: Update the orders array in `orders/orders.js`
- **Navigation**: Add new routes in `app.js`
- **Styling**: Customize `styles.css` for different themes

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

The application uses AngularJS 1.x with a modular structure. Each page can be developed as a separate component with its own controller and template.

For production deployment, consider:
- Minifying CSS and JavaScript
- Optimizing images
- Adding error handling
- Implementing proper data persistence
