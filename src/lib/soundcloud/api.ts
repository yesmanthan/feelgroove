
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
      const errorData = await response.json();
      console.error('SoundCloud API error response:', errorData);
      throw new Error(`SoundCloud API error: ${response.status} - ${errorData.errors ? errorData.errors[0] : 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('SoundCloud stream response:', data);
    
    if (data.hasError) {
      throw new Error(`SoundCloud API error: ${data.errors ? data.errors[0] : 'Unknown error'}`);
    }
    
    if (!data.url && !data.streamUrl) {
      throw new Error('No stream URL returned from SoundCloud API');
    }
    
    return data.url || data.streamUrl;
  } catch (error) {
    console.error('Error fetching SoundCloud stream:', error);
    throw error;
  }
};
