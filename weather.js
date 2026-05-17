const axios = require('axios');
const http = require('http');
const fs = require('fs');
const path = require('path');
// Function to fetch weather data
async function fetchWeatherData(city) {
const apiKey = 'e3bfd0ea161828dff11b72f904c22e30';
const apiUrl =
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
try {
const response = await axios.get(apiUrl);
const weatherData = response.data;
const weatherInfo = {
city: weatherData.name,
temperature: (weatherData.main.temp - 273.15).toFixed(2) + '°C',
description: weatherData.weather[0].description
};
return weatherInfo;
} catch (error) {
console.error('An error occurred:', error.message);
return null;
}
}
const url = require('url');
const server = http.createServer((req, res) => {
const parsedUrl = url.parse(req.url, true); // Parse the URL including query
parameters
if(req.method === 'GET' && parsedUrl.pathname === '/') {
// Read the HTML file and serve it as the response
const filePath = path.join( dirname, 'index.html');
fs.readFile(filePath, 'utf8', (err, data) => {
if (err) {
res.writeHead(500, { 'Content-Type': 'text/plain' });
res.end('Internal Server Error');
} else {
res.writeHead(200, { 'Content-Type': 'text/html' });
res.end(data);
}
});
} else if (req.method === 'GET' && parsedUrl.pathname === '/weather') {
// Handle weather information request with query parameters
const location = parsedUrl.query.location;
if (location) {
// Fetch weather data and send the response
fetchWeatherData(location)
  .then(weatherData => {
if (weatherData) {
// Display weather information
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify(weatherData));
} else {
// Return an error response
res.writeHead(404, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ error: 'Location not found' }));
}
})
.catch(error => {
console.error('An error occurred:', error.message);
res.writeHead(500, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ error: 'Internal Server Error' }));
});
} else {
res.writeHead(400, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ error: 'Location parameter missing' }));
}
} else {
res.writeHead(404, { 'Content-Type': 'text/plain' });
res.end('Not Found');
}
});
// Listen on a port (e.g., 3000)
const port = 3000;
server.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});
