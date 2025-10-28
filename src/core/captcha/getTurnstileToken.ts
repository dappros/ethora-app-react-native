import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export async function getTurnstileToken(): Promise<string> {
  const redirectUri = 'ethoraappreactnative://turnstile';
  const siteKey = process.env.EXPO_PUBLIC_SITE_KEY as string;
  const url = `https://app.ethora.com/turnstile?sitekey=${siteKey}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  console.log('Opening Turnstile URL:', url);
  console.log('Redirect URI:', redirectUri);
  return new Promise((resolve, reject) => {
    const sub = Linking.addEventListener('url', ({ url: receivedUrl }) => {
      console.log('Deep link received:', receivedUrl);
      try {
        const u = new URL(receivedUrl);
        const token = u.searchParams.get('token');
        const error = u.searchParams.get('error');
        console.log('Token:', token);
        console.log('Error:', error);
        if (token) {
          resolve(token);
        } else if (error) {
          reject(new Error(error));
        } else {
          reject(new Error('Turnstile cancelled'));
        }
      } catch (err) {
        console.error('Error parsing deep link:', err);
        reject(err);
      } finally {
        sub.remove();
        WebBrowser.dismissBrowser();
      }
    });
    WebBrowser.openAuthSessionAsync(url, redirectUri)
      .then((result) => {
        console.log('WebBrowser result:', result);
        if (result.type === 'cancel') {
          sub.remove();
          reject(new Error('User cancelled'));
        }
      })
      .catch((error) => {
        console.error('WebBrowser error:', error);
        sub.remove();
        reject(error);
      });
  });
}