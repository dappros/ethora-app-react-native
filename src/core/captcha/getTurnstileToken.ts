import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export async function getTurnstileToken(): Promise<string> {
  const redirectUri = 'ethoraappreactnative://turnstile';
  const siteKey = process.env.EXPO_PUBLIC_SITE_KEY as string;
  const url = `https://app.ethora.com/turnstile?sitekey=${siteKey}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  console.log('Opening Turnstile URL:', url);
  console.log('Redirect URI:', redirectUri);
  
  try {
    const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);
    console.log('WebBrowser result:', result);
    
    if (result.type === 'success' && result.url) {
      // Парсим токен из URL используя expo-linking
      const parsed = Linking.parse(result.url);
      const token = parsed.queryParams?.token as string | undefined;
      const error = parsed.queryParams?.error as string | undefined;
      
      console.log('Token from URL:', token);
      console.log('Error from URL:', error);
      
      if (token) {
        return token;
      } else if (error) {
        throw new Error(error);
      } else {
        throw new Error('No token received');
      }
    } else if (result.type === 'cancel') {
      throw new Error('User cancelled');
    } else {
      throw new Error('Unknown result type: ' + result.type);
    }
  } catch (error) {
    console.error('Turnstile error:', error);
    throw error;
  }
}