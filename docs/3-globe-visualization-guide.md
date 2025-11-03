# Demo 3: 3D Data Visualization Globe

## Overview

**What You're Building:** Interactive 3D globe with real-time data visualization - earthquakes, flights, climate data, or other global datasets.

**Target Build Time:** 3-4 hours with AI assistance

**What It Normally Takes:** 1-2 weeks + requires 3D graphics expertise

**Tech Stack:** Three.js + Globe.gl library + public data APIs

**Live Demo Value:** Impressive 3D graphics showing real scientific/geographic data like news organizations and research labs use

---

## The Wow Factor

### What Makes This Impressive

1. **3D is inherently cool** - Spinning globe commands attention
2. **Real data** - Not fake, actual earthquake/flight/climate data
3. **Interactive** - Rotate, zoom, click for details
4. **Professional quality** - "This is what news orgs use for data journalism"
5. **Educational** - Connects to geography, science, current events

### Talking Points for Event

- "This is real earthquake data from the last 30 days - each point is an actual earthquake"
- "Built in 3-4 hours with AI. Professional 3D data viz takes 1-2 weeks"
- "I don't have a 3D graphics background - AI helped me with the Three.js code"
- "This is the kind of visualization you see on news sites like NYTimes or BBC"
- "You can rotate it, zoom in, click any point for details"
- "It automatically updates with fresh data every day"

---

## Build Process with Claude

### Step 1: Basic 3D Globe Setup (30 minutes)

**Prompt to Claude:**

```
Create an interactive 3D Earth globe using Three.js and Globe.gl:

SETUP:
- Use Globe.gl library (via CDN)
- Create full-screen 3D globe
- High-resolution Earth texture from NASA
- Realistic atmosphere effect
- Ambient space background with stars

CONTROLS:
- Mouse drag to rotate globe
- Mouse wheel to zoom in/out
- Auto-rotation when not interacting
- Smooth damping on interactions

APPEARANCE:
- Night side should show city lights
- Subtle atmosphere glow
- Dark space background
- Anti-aliased rendering

Provide clean code with comments explaining the 3D concepts.
```

**What You'll Get:** Beautiful spinning Earth globe

**Build Time:** 20-30 minutes

**Test:** Should rotate smoothly, zoom should work

---

### Step 2: Add Earthquake Data (45 minutes)

**Prompt to Claude:**

```
Add real earthquake data visualization to the globe:

DATA SOURCE:
- Use USGS Earthquake API (free, no key required)
- Fetch earthquakes from last 30 days
- API: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson

VISUALIZATION:
- Plot each earthquake as a 3D point on globe
- Size based on magnitude (larger quake = larger point)
- Color based on magnitude:
  - 0-3: Green (minor)
  - 3-5: Yellow (moderate)
  - 5-6: Orange (strong)
  - 6+: Red (major)
- Height above surface = magnitude intensity
- Glow effect on points

INTERACTIVITY:
- Hover shows tooltip with:
  - Magnitude
  - Location name
  - Depth
  - Date/time
- Click to show detailed info panel
- Auto-rotate pauses on interaction

DATA REFRESH:
- Fetch fresh data on page load
- "Last updated" timestamp
- Refresh button

Make the visualization both scientific and beautiful.
```

**What You'll Get:** Globe with live earthquake visualization

**Build Time:** 35-45 minutes

**Test:** Verify real earthquake data appears, tooltips work

---

### Step 3: Add Multiple Dataset Support (60 minutes)

**Prompt to Claude:**

```
Add support for multiple global datasets beyond earthquakes:

DATASETS TO SUPPORT:
1. Earthquakes (already implemented)
2. Flight paths (live air traffic)
3. COVID-19 cases by country
4. Wildfire locations
5. Meteor sightings
6. City populations

IMPLEMENTATION:
- Dataset selector dropdown in UI
- Each dataset has custom visualization:
  - Earthquakes: Points with varying size/color
  - Flights: Arcs between cities
  - COVID: Country polygons with color intensity
  - Wildfires: Pulsing orange points
  - Meteors: Streak effects
  - Cities: Light points sized by population

DATA SOURCES:
- Earthquakes: USGS API
- Flights: OpenSky Network API (free tier)
- COVID: Disease.sh API
- Wildfires: NASA FIRMS
- Meteors: American Meteor Society API
- Cities: SimpleMaps dataset (static JSON)

UI:
- Dropdown to switch datasets
- Legend explaining the visualization
- Statistics panel (count, totals, etc.)

Handle API failures gracefully with error messages.
```

**What You'll Get:** Multi-dataset 3D globe

**Build Time:** 45-60 minutes

**Test:** Try switching between datasets, verify each loads

---

### Step 4: Add Time-Based Playback (45 minutes)

**Prompt to Claude:**

```
Add time-based animation to show how data changes over time:

TIME CONTROLS:
- Timeline slider showing date range
- Play/pause button
- Speed control (1x, 2x, 5x, 10x)
- Step forward/backward buttons

ANIMATION:
- For earthquakes: Show them appearing when they occurred
- For flights: Animate flight paths in real-time
- For COVID: Show case counts evolving over time
- Smooth transitions between time steps

VISUALIZATION:
- Current date displayed prominently
- Data points fade in/out based on time
- Trail effect showing recent history
- Color intensity shows recency

UI:
- Professional timeline control panel
- Date range picker
- Loop toggle
- Reset to current time button

Make the time visualization smooth and educational - like a time-lapse documentary.
```

**What You'll Get:** Animated time-based visualization

**Build Time:** 35-45 minutes

**Test:** Play through timeline, verify smooth animation

---

### Step 5: Add Info Panels & Statistics (30 minutes)

**Prompt to Claude:**

```
Add comprehensive information panels and statistics:

INFO PANEL (Right Side):
- Dataset description
- Current data point details (when clicked)
- Related information (links to sources)
- Images (if available)

STATISTICS PANEL (Top):
- Total count (e.g., "1,247 earthquakes in last 30 days")
- Largest/strongest/most significant
- Time range covered
- Last data refresh time
- Average/median values

VISUALIZATIONS IN PANELS:
- Mini histogram of data distribution
- Trend line if time-based
- Geographic breakdown (by continent/country)

FEATURES:
- Panels slide in/out smoothly
- Keyboard shortcuts to toggle
- Print/export data button
- Share button (copy URL with current view)

Make it information-rich but not cluttered - clean, modern design.
```

**What You'll Get:** Professional info and statistics panels

**Build Time:** 25-35 minutes

**Test:** Click points, verify panels show accurate data

---

### Step 6: Add Custom Data Upload (30 minutes)

**Prompt to Claude:**

```
Allow users to upload and visualize their own geographic datasets:

FILE UPLOAD:
- Accept CSV or GeoJSON files
- Required columns: latitude, longitude, (optional: value, label, date)
- Drag-and-drop interface
- File validation and error messages

DATA PROCESSING:
- Parse uploaded file
- Auto-detect column types
- Suggest visualization style based on data
- Preview before applying

VISUALIZATION OPTIONS:
- Point size: Fixed or data-driven
- Point color: Single color or gradient based on values
- Labels: Show/hide
- Clustering: Group nearby points

EXAMPLES:
- Provide sample CSV files users can download:
  - Historical battles
  - World capitals
  - Volcanic eruptions
  - Unesco sites
  - Their own data!

UI:
- Clear instructions for data format
- Example data to download
- Reset to default datasets button

Make it easy enough that a teacher could use it in class.
```

**What You'll Get:** Custom data visualization capability

**Build Time:** 25-35 minutes

**Test:** Upload sample CSV, verify it renders correctly

---

### Step 7: Polish & Advanced Features (45 minutes)

**Prompt to Claude:**

```
Final polish and advanced features for demo-ready globe:

VISUAL ENHANCEMENTS:
- Add satellite view option (switch from Earth to black marble night)
- Cloud layer that rotates independently
- Sun position (realistic day/night terminator)
- Country borders toggle
- Ocean depth visualization

PERFORMANCE:
- Level of detail (LOD) - reduce point count when zoomed out
- Frustum culling for off-screen points
- Efficient rendering for 10,000+ points
- Loading progress indicator

CAMERA PRESETS:
- Quick jump buttons to interesting locations
- "Fly to" animation for smooth camera movement
- Preset views: "Show all earthquakes", "North America", "Pacific Rim"

ACCESSIBILITY:
- Keyboard navigation
- Screen reader descriptions
- High contrast mode
- Reduced motion option

EXPORT:
- Save screenshot (high-res PNG)
- Export current view as shareable link
- Download data as CSV

VR/IMMERSIVE (Optional):
- WebVR support for VR headsets
- Fullscreen button

Make it production-quality and bulletproof for live demo.
```

**What You'll Get:** Polished, feature-rich globe visualization

**Build Time:** 35-45 minutes

**Test:** Try all features, verify performance with large datasets

---

## Data Sources

### Free APIs (No Key Required)

**Earthquakes:**

```
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
```

**All Earthquakes M2.5+ (30 days):**

```
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson
```

### Free APIs (Key Required - Free Tier)

**Flight Data (OpenSky Network):**

```
https://opensky-network.org/api/states/all
Free tier: 400 credits/day, no commercial use
```

**COVID-19 Data (disease.sh):**

```
https://disease.sh/v3/covid-19/countries
No key needed, updates daily
```

**NASA FIRMS (Wildfires):**

```
https://firms.modaps.eosdis.nasa.gov/api/area/
Requires free API key from NASA
```

### Static Datasets

**World Cities:**

- SimpleMaps: https://simplemaps.com/data/world-cities (free basic dataset)

**Historical Events:**

- Curate your own CSV from public datasets

---

## Example Custom Datasets for Demo

Create these CSV files to show variety:

**battles.csv** (Historical battles)

```csv
latitude,longitude,name,year,casualties
50.8503,4.3517,Battle of Waterloo,1815,50000
37.0902,25.3256,Battle of Salamis,480 BCE,40000
...
```

**unesco-sites.csv** (World Heritage Sites)

```csv
latitude,longitude,name,country,year_inscribed
27.1751,78.0421,Taj Mahal,India,1983
41.8902,12.4922,Colosseum,Italy,1980
...
```

**meteor-impacts.csv** (Meteor impact craters)

```csv
latitude,longitude,name,diameter_km,age_million_years
35.0,-111.0,Barringer Crater,1.2,0.05
...
```

---

## Deployment

### GitHub Pages (Recommended)

```bash
git init
git add .
git commit -m "3D globe data visualization"
git remote add origin https://github.com/yourusername/globe-viz-demo
git push -u origin main

# Enable GitHub Pages
# URL: https://yourusername.github.io/globe-viz-demo
```

### Performance Considerations

- Compress texture images
- Use CDN for Three.js library
- Lazy-load datasets
- Cache API responses in localStorage

---

## Testing Checklist

Before the event:

**Functionality:**

- [ ] Globe renders and rotates smoothly
- [ ] All datasets load correctly
- [ ] Earthquake data is current (last 30 days)
- [ ] Tooltips show accurate information
- [ ] Click interactions work
- [ ] Time-based playback animates smoothly

**Performance:**

- [ ] Runs at 60fps when idle
- [ ] Runs at 30fps+ with 1000+ points
- [ ] No memory leaks over 15 minutes
- [ ] Responsive on zoom in/out

**Data:**

- [ ] API calls succeed (test with network inspector)
- [ ] Error handling shows user-friendly messages
- [ ] Backup data available if API fails
- [ ] Last updated timestamp is accurate

**UI:**

- [ ] All buttons and controls work
- [ ] Panels slide smoothly
- [ ] Dataset switcher changes visualization
- [ ] Statistics update correctly
- [ ] File upload accepts valid CSV

**Compatibility:**

- [ ] Works in Chrome, Firefox, Safari
- [ ] Works on tablet (touch controls)
- [ ] Degrades gracefully on older devices
- [ ] WebGL availability check works

---

## Demo Presentation Script

### Setup (Before Demo)

- Load globe with earthquake dataset
- Position camera showing interesting cluster (e.g., Pacific Ring of Fire)
- Have auto-rotation enabled
- Have info panel visible

### Presentation (3 minutes)

**Visual Hook (15 seconds):**
[Let globe rotate, students watch]
"This is real earthquake data from the last 30 days. Each point you see is an actual earthquake that happened somewhere on Earth."

**Interaction Demo (45 seconds):**
[Rotate globe to show different areas]
"You can rotate it, zoom in..." [zoom to Pacific]
"Here's the Pacific Ring of Fire - where most earthquakes happen."

[Click a large earthquake point]
"Click any earthquake to see details: magnitude 6.2, depth 10km, happened 3 days ago in Japan."

**Dataset Switching (60 seconds):**
[Switch to flight dataset]
"But it's not just earthquakes. Watch - I'm switching to live flight data. These are actual planes in the air right now, flying between cities."

[Switch to COVID or wildfire data]
"We can visualize any global data: COVID cases, wildfires, even historical battles or UNESCO sites."

**The Reveal (60 seconds):**
"This type of 3D data visualization is what news organizations like NYTimes or BBC use for data journalism stories. Research labs use it for scientific data."

"I built this in about 4 hours with AI assistance. Normally, professional 3D data visualization takes 1-2 weeks minimum because you need expertise in:"

- 3D graphics programming (Three.js, WebGL)
- Geographic projections and coordinate systems
- Data processing and API integration
- Performance optimization

"I don't have a 3D graphics background. But I could describe the visualization I wanted, and AI helped me implement the technical details."

[Show time-based playback]
"You can even animate it over time - watch the earthquakes appear as they happened over the last month."

---

## Common Questions & Answers

**Q: "Is this data real or simulated?"**
A: "100% real. The earthquake data comes from USGS (United States Geological Survey), updated continuously. Flight data from OpenSky Network, actual transponder signals from planes. You're seeing the world as it is right now."

**Q: "Could you add [different dataset]?"**
A: "Yes! If the data has latitude/longitude, we can visualize it. I built in custom data upload - you can drop a CSV file and visualize anything: your vacation photos, historical events, scientific research data."

**Q: "How do you make it 3D?"**
A: "Using WebGL through a library called Three.js. WebGL is a way to use your graphics card to render 3D in the browser - the same technology that powers browser-based games. The globe is actually thousands of triangles with an Earth texture wrapped around a sphere."

**Q: "Why does Earth look so realistic?"**
A: "The textures come from NASA satellite imagery - actual photographs from space. The night side shows city lights from real nighttime satellite photos. The atmosphere glow is a shader effect that mimics how Earth looks from space."

**Q: "Could this be used for serious research?"**
A: "Absolutely. Scientists use visualizations like this to identify patterns - like earthquake clusters, flight routes spreading disease, climate change effects. The visual representation makes patterns obvious that would be hidden in spreadsheets."

---

## Variations & Extensions

### Advanced Features

**Real-time Collaboration:**

- Multiple users viewing same globe
- Shared annotations
- Chat panel for discussing data

**AR/VR Mode:**

- View globe in augmented reality (phone camera)
- VR headset support for immersive view
- Hand tracking for gesture controls

**Machine Learning Integration:**

- Predict next earthquake locations
- Cluster analysis of patterns
- Anomaly detection visualization

**Educational Mode:**

- Guided tours ("Let me show you the Ring of Fire...")
- Quiz mode (find the country, identify the dataset)
- Lesson plans for teachers

---

## Resources

### Libraries

- **Globe.gl:** https://globe.gl/ (3D globe specifically for data viz)
- **Three.js:** https://threejs.org/ (3D graphics framework)
- **Cesium:** https://cesium.com/ (Alternative, more advanced)

### Data Sources

- **USGS Earthquakes:** https://earthquake.usgs.gov/earthquakes/feed/
- **OpenSky Network:** https://opensky-network.org/
- **Natural Earth Data:** https://www.naturalearthdata.com/ (geographic datasets)
- **Our World in Data:** https://ourworldindata.org/ (various global datasets)

### Textures

- **NASA Visible Earth:** https://visibleearth.nasa.gov/
- **Solar System Scope:** https://www.solarsystemscope.com/textures/ (planet textures)

### Learning

- **Three.js Journey:** https://threejs-journey.com/
- **WebGL Fundamentals:** https://webglfundamentals.org/

---

## Success Criteria

You'll know this demo is ready when:

1. ✅ Non-technical people say "That's beautiful!"
2. ✅ Teachers ask "Can I use this in my class?"
3. ✅ Students start pointing out their countries/cities
4. ✅ Parents take videos to show family
5. ✅ Geography/science teachers engage deeply
6. ✅ Someone says "This looks like what they use on the news"
7. ✅ You can confidently explain the data sources and visualization

**This is your "sophisticated" demo - it shows AI helps build professional tools for serious applications!**
