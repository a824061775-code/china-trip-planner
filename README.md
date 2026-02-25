# China Trip Planner - Developer Guide 

This application is a static frontend prototype for a China Trip Planner. It currently uses a local `data.ts` file to store itinerary templates.

## How to replace `data.ts` with a real API

To transition from static data to a dynamic backend API, follow these steps:

### 1. Backend API Implementation
Create a RESTful API endpoint (e.g., `GET /api/itinerary`) that accepts the following parameters:
- `city`: The destination city (e.g., "Shanghai")
- `days`: Number of days (1-7)
- `interests`: An array of strings (e.g., `["Food", "Culture"]`)

The API should return a JSON response matching the `DayPlan[]` interface defined in `src/data.ts`.

### 2. Update `src/App.tsx`
In the `handleGenerate` function, replace the `setTimeout` simulation with a real `fetch` call:

```typescript
const handleGenerate = async () => {
  setIsGenerating(true);
  setItinerary(null);
  
  try {
    const response = await fetch(`/api/itinerary?city=${city}&days=${days}&interests=${interests.join(',')}`);
    if (!response.ok) throw new Error('Failed to fetch itinerary');
    
    const data: DayPlan[] = await response.json();
    setItinerary(data);
    setOpenDay(1);
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    alert('Failed to generate itinerary. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};
```

### 3. Data Structure Compatibility
Ensure your API returns objects that include the extended fields for each activity:
- `name_en`, `name_zh`, `pinyin`
- `address_zh`, `address_en`, `district_zh`, `city_zh`
- `map_query`, `metro_hint`

### 4. Environment Variables
If your API requires an API key or a specific base URL, add them to `.env.example` and access them via `import.meta.env.VITE_API_URL`.

## Project Structure
- `src/data.ts`: Static data templates and interfaces.
- `src/components/POICard.tsx`: Component for rendering individual points of interest with bilingual support.
- `src/utils/maps.ts`: Logic for generating map search URLs.
- `src/utils/clipboard.ts`: Cross-browser clipboard copy logic.
