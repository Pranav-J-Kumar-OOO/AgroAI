async function getGroundLevel(latitude, longitude) {
    const url = `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].elevation;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
}

// Example coordinates for a place in India
const latitude = 19.0760;
const longitude = 72.8777;

getGroundLevel(latitude, longitude)
    .then(groundLevel => {
        console.log(`Ground level at (${latitude}, ${longitude}) in India is ${groundLevel} meters.`);
    })
    .catch(error => {
        console.error('Failed to get ground level:', error);
    });
