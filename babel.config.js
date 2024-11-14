module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@screens": "./src/screens",
          "@stores": "./src/stores",
          "@assets": "./src/assets",
          "@components": "./src/components",
          "@hooks": "./src/hooks",
          "@constants": "./src/constants",
          "@xmpp": "./src/xmpp",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
