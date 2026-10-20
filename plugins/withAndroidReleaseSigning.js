const { withAppBuildGradle } = require('expo/config-plugins');

// Signs Android release builds with the Google Play upload key. The keystore
// path and passwords come from ANDROID_UPLOAD_* in the project's .env (or the
// environment), read by Gradle itself so `./gradlew bundleRelease` works
// without the Expo CLI. Without them release falls back to the debug key.
const MARKER = '// withAndroidReleaseSigning';

const ENV_READER = `${MARKER}: upload key from ../.env or the environment
def uploadKeyEnv = [:]
def uploadKeyEnvFile = new File(rootProject.projectDir.parentFile, '.env')
if (uploadKeyEnvFile.exists()) {
    uploadKeyEnvFile.eachLine { line ->
        def m = line =~ /^\\s*(ANDROID_UPLOAD_[A-Z_]+)\\s*=\\s*(.*?)\\s*$/
        if (m) uploadKeyEnv[m[0][1]] = m[0][2]
    }
}
System.getenv().each { k, v -> if (k.startsWith('ANDROID_UPLOAD_')) uploadKeyEnv[k] = v }
def hasUploadKey = uploadKeyEnv['ANDROID_UPLOAD_STORE_FILE'] && uploadKeyEnv['ANDROID_UPLOAD_STORE_PASSWORD']

`;

const RELEASE_SIGNING = `signingConfigs {
        if (hasUploadKey) {
            release {
                def f = new File(uploadKeyEnv['ANDROID_UPLOAD_STORE_FILE'])
                storeFile f.absolute ? f : new File(rootProject.projectDir.parentFile, f.path)
                storePassword uploadKeyEnv['ANDROID_UPLOAD_STORE_PASSWORD']
                keyAlias uploadKeyEnv['ANDROID_UPLOAD_KEY_ALIAS']
                keyPassword uploadKeyEnv['ANDROID_UPLOAD_KEY_PASSWORD'] ?: uploadKeyEnv['ANDROID_UPLOAD_STORE_PASSWORD']
            }
        }`;

const applyReleaseSigning = (gradle) => {
  if (gradle.includes(MARKER)) return gradle;

  const releaseBlock = /(buildTypes \{[\s\S]*?\n\s*release \{[\s\S]*?)signingConfig signingConfigs\.debug/;
  if (!gradle.includes('signingConfigs {') || !releaseBlock.test(gradle)) {
    throw new Error('withAndroidReleaseSigning: unexpected app/build.gradle layout');
  }

  return gradle
    .replace(/^android \{/m, `${ENV_READER}android {`)
    .replace('signingConfigs {', RELEASE_SIGNING)
    .replace(
      releaseBlock,
      '$1signingConfig hasUploadKey ? signingConfigs.release : signingConfigs.debug'
    );
};

const withAndroidReleaseSigning = (config) =>
  withAppBuildGradle(config, (cfg) => {
    cfg.modResults.contents = applyReleaseSigning(cfg.modResults.contents);
    return cfg;
  });

module.exports = withAndroidReleaseSigning;
module.exports.applyReleaseSigning = applyReleaseSigning;
