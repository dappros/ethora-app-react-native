import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  theme?: 'light' | 'dark' | 'auto';
}

export const Turnstile: React.FC<TurnstileProps> = ({
  siteKey,
  onVerify,
  onError,
  theme = 'light',
}) => {
  const webViewRef = useRef<WebView>(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cloudflare Turnstile</title>
      <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: transparent;
        }
        .turnstile-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      </style>
    </head>
    <body>
      <div class="turnstile-container">
        <div class="cf-turnstile" 
             data-sitekey="${siteKey}" 
             data-theme="${theme}"
             data-callback="onTurnstileCallback"
             data-error-callback="onTurnstileError">
        </div>
      </div>
      
      <script>
        window.onTurnstileCallback = function(token) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'success',
            token: token
          }));
        };
        
        window.onTurnstileError = function(error) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            error: error
          }));
        };
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'success') {
        onVerify(data.token);
      } else if (data.type === 'error') {
        onError?.(data.error);
      }
    } catch (error) {
      console.error('Turnstile message parsing error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 65,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default Turnstile;
