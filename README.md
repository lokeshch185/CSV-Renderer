# DataViewer - Modern Data Visualization Platform

A React-based web application for viewing, analyzing, and managing datasets with a modern, responsive interface built using Vite and Tailwind CSS.

## 🚀 Features

### Authentication
- **User Login/Signup**: Clean, modern authentication interface (Demo mode - no backend logic)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Form Validation**: Client-side validation with error handling

### Data Management
- **CSV Upload**: Drag & drop CSV file upload with preview
- **Manual Data Entry**: Dynamic column creation and data input
- **File Validation**: CSV format validation and error handling

### Data Visualization
- **Interactive Table**: Responsive data table with sorting capabilities
- **Advanced Filtering**: Filter by multiple criteria (department, status, city, age range)
- **Search Functionality**: Global search across all data fields
- **Column Management**: Show/hide columns dynamically
- **Pagination**: Efficient data browsing with configurable page sizes

### User Experience
- **Modern UI**: Clean, professional design with smooth animations
- **Responsive Layout**: Adaptive sidebar navigation and mobile-friendly interface
- **Real-time Updates**: Instant filtering and search results
- **Export Functionality**: Download filtered data as CSV

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Development**: ESLint, PostCSS, Autoprefixer

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.jsx      # Main layout with navigation
├── pages/              # Page components
│   ├── Login.jsx       # User authentication
│   ├── SignUp.jsx      # User registration
│   ├── Dashboard.jsx   # Main dashboard view
│   ├── DataUpload.jsx  # Data upload interface
│   └── DataViewer.jsx  # Data viewing and filtering
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DataViewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### Authentication
- **Demo Mode**: Use any email and password to sign in
- **Navigation**: After login, you'll be redirected to the dashboard
- **Logout**: Click the logout icon in the sidebar

### Data Upload
1. **CSV Upload**:
   - Drag and drop CSV files or click to browse
   - Preview uploaded data before confirmation
   - Supported format: CSV files only

2. **Manual Entry**:
   - Create custom columns with dynamic naming
   - Add/remove rows and columns as needed
   - Real-time data validation

### Data Viewing
1. **Table Navigation**:
   - Sort columns by clicking headers
   - Use pagination for large datasets
   - Toggle column visibility

2. **Filtering**:
   - Apply multiple filters simultaneously
   - Filter by department, status, city, and age range
   - Clear all filters with one click

3. **Search**:
   - Global search across all fields
   - Real-time results as you type
   - Combined with filter criteria

4. **Export**:
   - Download filtered data as CSV
   - Exports only visible columns
   - Respects current filters and search

## 🎨 Design System

### Color Palette
- **Primary**: Blue shades (#3B82F6, #2563EB, #1D4ED8)
- **Secondary**: Gray shades (#64748B, #475569, #334155)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately across devices

### Components
- **Buttons**: Primary, secondary, and disabled states
- **Cards**: Consistent spacing and shadow system
- **Forms**: Input fields with focus states and validation
- **Tables**: Responsive design with hover effects

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Features
- **Mobile-first approach**
- **Collapsible sidebar navigation**
- **Touch-friendly interface**
- **Optimized table scrolling**

## 🔧 Customization

### Tailwind Configuration
The project includes a custom Tailwind configuration with:
- Extended color palette
- Custom animations and keyframes
- Responsive design utilities
- Component-specific classes

### CSS Customization
- Custom component classes in `src/index.css`
- Utility-first approach with Tailwind
- Easy to modify and extend

## 📝 Code Quality

### Standards
- **ESLint**: Code linting and formatting
- **Component Documentation**: JSDoc comments for all components
- **Consistent Naming**: Follows React best practices
- **Type Safety**: Proper prop handling and state management

### Best Practices
- **Functional Components**: Modern React hooks usage
- **State Management**: Local state with useState and useMemo
- **Performance**: Optimized re-renders and filtering
- **Accessibility**: Semantic HTML and ARIA labels

## 🚧 Demo Mode

This application runs in demo mode with the following characteristics:
- **No Backend**: All data is stored in browser memory
- **Persistent Data**: Data persists during the session
- **Mock Datasets**: Sample data for demonstration
- **Simulated Actions**: Upload delays and success messages

## 🔮 Future Enhancements

### Planned Features
- **Data Visualization**: Charts and graphs
- **Advanced Analytics**: Statistical analysis tools
- **User Management**: Multi-user support
- **Data Import/Export**: Additional file formats
- **Real-time Collaboration**: Shared datasets

### Technical Improvements
- **State Management**: Redux or Zustand integration
- **Testing**: Unit and integration tests
- **Performance**: Virtual scrolling for large datasets
- **Offline Support**: Service worker implementation

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Follow existing code patterns
- Add JSDoc comments for new components
- Ensure responsive design compatibility
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **React Team**: Amazing frontend framework
- **Vite**: Fast build tool and dev server

## 📞 Support

For questions or support:
- **Issues**: Create an issue in the repository
- **Documentation**: Check this README and code comments
- **Demo**: Test the application at the provided URL

---

**DataViewer** - Making data exploration beautiful and intuitive.
