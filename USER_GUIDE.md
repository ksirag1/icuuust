# UUST IUM Interactive Map - User Guide

## Overview

The UUST IUM Interactive Map is a web-based navigation tool designed to help students, faculty, and visitors navigate the Ufa University of Science and Technology (УУНИТ) campus efficiently. The application provides an interactive map of the campus with detailed building information and room selection capabilities.

## Features

### Campus View

The main campus view displays:

- **Interactive Map**: A zoomable and pannable map of the UUST campus with OpenStreetMap tiles
- **Building Markers**: Blue building icons representing all 9 campus buildings
- **Building Boundaries**: Semi-transparent blue polygons showing the exact boundaries of each building
- **Restricted Navigation**: The map is bounded to the campus area, preventing users from scrolling beyond the campus boundaries

**How to Use:**
1. Click on any building marker (blue building icon) to view its details
2. Click on a building boundary polygon to select that building
3. Use the zoom controls (+/-) to zoom in and out
4. Drag the map to pan around the campus
5. The map will automatically prevent you from viewing areas outside the campus

### Building View

When you select a building, the application switches to a detailed building view showing:

- **Building Map**: A zoomed-in map centered on the selected building with its boundaries highlighted in red
- **Floor Selector**: Buttons to switch between floors 1-5
- **Room List**: A list of available rooms on the selected floor
- **Room Selection**: Click on any room to select it and view its details

**How to Use:**
1. Click a floor number (1-5) to view rooms on that floor
2. Click on a room in the list to select it
3. The selected room will be highlighted in blue
4. View the selected room details in the "Selected Room" panel at the bottom
5. Click "Back to Campus" to return to the campus view

## Navigation Tips

- **Zoom Levels**: Use the zoom controls to get a better view of buildings. Zoom level 17 shows the entire campus, while zoom level 20 shows detailed building layouts
- **Building Selection**: You can select a building by clicking either the building marker or its boundary polygon
- **Room Numbers**: Room numbers follow the format: Floor + Room ID (e.g., Room 101 = Floor 1, Room 1)
- **Boundary Enforcement**: The map automatically prevents you from scrolling beyond the campus boundaries, ensuring you stay focused on the UUST area

## Technical Details

### Technologies Used

- **Frontend**: React 19 with TypeScript
- **Mapping Library**: Leaflet.js with OpenStreetMap tiles
- **Styling**: Tailwind CSS 4
- **Backend**: Express.js with tRPC
- **Database**: MySQL with Drizzle ORM

### Browser Compatibility

The application works best on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance

- The map uses efficient tile loading from OpenStreetMap
- Building boundaries are rendered as SVG polygons for optimal performance
- The application supports zoom levels 17-20 for detailed campus navigation

## Future Enhancements

The following features are planned for future releases:

- **Admin Panel**: Add or modify buildings, rooms, and floor plans without code
- **Search Functionality**: Search for specific rooms or buildings by name
- **Schedule Integration**: View class schedules and room availability
- **Mobile App**: Native iOS and Android applications
- **Real-time Updates**: Live updates for room availability and campus events
- **Accessibility Features**: Enhanced support for users with disabilities
- **Multi-language Support**: Support for multiple languages including Russian and English

## Troubleshooting

**Issue: Map is not loading**
- Ensure you have an active internet connection
- Try refreshing the page
- Clear your browser cache and reload

**Issue: Building markers are not visible**
- Zoom in to level 18 or higher to see building markers clearly
- Ensure you are viewing the campus area

**Issue: Room selection is not working**
- Make sure you have selected a floor first
- Try clicking directly on the room name in the list

## Contact & Support

For questions, bug reports, or feature requests, please contact the development team at:
- **Email**: support@uust.edu
- **GitHub**: https://github.com/uust/interactive-map

## Version Information

- **Current Version**: 1.0.0 (Prototype)
- **Release Date**: November 2025
- **Status**: Active Development

---

**Last Updated**: November 13, 2025
