
interface SoundCloudStreamOptions {
  streamId: string;
  trackAuthorization: string;
  rapidApiKey: string;
}

export const getSoundCloudStreamUrl = async (options: SoundCloudStreamOptions): Promise<string> => {
  try {
    const { streamId, trackAuthorization, rapidApiKey } = options;
    const apiUrl = `https://soundcloud-api3.p.rapidapi.com/getStreamUrl?streamId=${encodeURIComponent(streamId)}&trackAuthorization=${encodeURIComponent(trackAuthorization)}`;
    
    console.log('Fetching SoundCloud stream URL...');
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'soundcloud-api3.p.rapidapi.com',
        'x-rapidapi-key': rapidApiKey || '88da990a60mshf135c8a428b372ap1f3e67jsn5f9cae09aadc'
      }
    });
    
    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('SoundCloud stream response:', data);
    
    if (!data.url) {
      throw new Error('No stream URL returned from SoundCloud API');
    }
    
    return data.url;
  } catch (error) {
    console.error('Error fetching SoundCloud stream:', error);
    throw error;
  }
};
