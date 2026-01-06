export const GenerateID = () => {
    // This function should return a unique identificator string for the services based on the timestamp
    // so we are sure they are unique across all de available services
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let timestamp = Date.now().toString(36).toUpperCase(); // Convert timestamp to base 36
    let id = '';
    for (let i = 0; i < 10; i++) {
        let index = (timestamp.charCodeAt(i % timestamp.length) + i) % chars.length;
        id += chars[index];
    }
    return id;
}
