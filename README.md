# AgroAI 🌾
AI-powered precision farming assistant built to help 
farmers adapt to climate change.

Traditional farming knowledge is becoming unreliable —
crops that worked for generations are failing due to 
shifting climates, erratic rainfall, and soil degradation.
AgroAI bridges that gap by combining real-time 
environmental data with AI to give farmers actionable, 
land-specific guidance.

AgroAI takes a farmer's land coordinates and pulls live 
data from multiple sources — satellite imagery, soil 
composition, terrain, climate history, weather forecasts, 
and precipitation data — then feeds it through OpenAI's 
API to generate hyper-specific farming recommendations.

## What it recommends
- Optimal crops for the specific land and climate
- Mixed cropping strategies
- Rotational cropping schedules
- Soil-specific farming methods

## Stack
- Node.js (backend + API orchestration) 
- JavaScript / HTML (frontend)
- OpenAI API (recommendation engine)
- Satellite & soil composition APIs
- Weather + precipitation forecast APIs
- Terrain & climate data APIs

## Architecture
Land coordinates → multi-API data aggregation → 
OpenAI processing → farming recommendations

Delivered via web. Easily extendable to SMS/email 
for farmers without smartphones.
