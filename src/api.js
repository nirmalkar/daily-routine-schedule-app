const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const fetchDailyData = async (date) => {
    console.log('fetchDailyData called for date:', date); // Added console log
    try {
        const response = await fetch(`${API_BASE_URL}/api/daily-data/${date}`);
        if (!response.ok) {
            const errorText = await response.text(); // Get error message from server
            throw new Error(`Failed to fetch data: ${response.status} - ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching daily data:', error);
        console.log('Data fetch failed or corrupted:', error); // Added console log
        throw error; // Re-throw the error for the component to handle
    }
};

export const saveDailyData = async (date, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/daily-data/${date}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save data: ${response.status} - ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error saving daily data:', error);
        throw error;
    }
};
