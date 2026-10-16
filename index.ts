// Custom entry: the Android handler for encrypted pushes must exist before
// expo-router starts. An encrypted push is data-only, so when the app is not
// running Android starts it headless just to run that task; the task is
// defined at module scope here so the headless bundle finds it.
import '@/src/modules/push/sealedPushTask';
import 'expo-router/entry';
