const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const getTimezoneOffset = () => {
    // Returns timezone offset in minutes
    return new Date().getTimezoneOffset().toString();
};

export const fetchDailyData = async (date) => {
    console.log('fetchDailyData called for date:', date);
    try {
        const response = await fetch(`${API_BASE_URL}/api/daily-data/${date}`, {
            headers: {
                'X-Timezone-Offset': getTimezoneOffset(),
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `Failed to fetch data: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching daily data:', error);
        throw error;
    }
};

export const saveDailyData = async (date, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/daily-data/${date}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Timezone-Offset': getTimezoneOffset(),
            },
            body: JSON.stringify(data),
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || `Failed to save data: ${response.status}`);
        }
        
        return responseData;
    } catch (error) {
        console.error('Error saving daily data:', error);
        throw error;
    }
};
