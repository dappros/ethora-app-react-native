// react-native-callkeep is used for CallKit on iOS only. On Android the
// ongoing call is a foreground-service notification from the local
// `ethora-call-notification` module instead: a ConnectionService would ask
// for phone-account permission and hand the call to the system dialer UI.
module.exports = {
  dependencies: {
    'react-native-callkeep': {
      platforms: {
        android: null,
      },
    },
  },
};
