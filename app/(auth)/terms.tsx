import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/src/core/components';
import { useAppColors } from '@/src/core/theme';
import { useConfig } from '@/src/modules/config/hooks';
import { TERMS_OF_USE } from '@/src/modules/legal/termsOfUse';
import { acceptTerms } from '@/src/modules/legal/termsAcceptance';

/**
 * Terms of use. Shown before sign-in and registration until accepted ((auth)/_layout);
 * `?mode=view` opens them to read again from the login screen.
 */
export default function Terms() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const readOnly = mode === 'view';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const { status: configStatus } = useConfig();
  const [submitting, setSubmitting] = useState(false);

  const onAgree = async () => {
    setSubmitting(true);
    await acceptTerms();
    router.replace(configStatus === 'success' ? '/(auth)/login' : '/(auth)/domain');
  };

  const onClose = () => (router.canGoBack() ? router.back() : router.replace('/(auth)/login'));

  const bodyText = [styles.body, { color: colors.text }];

  return (
    <View testID="terms-screen" style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, borderColor: colors.border }]}>
        {readOnly ? (
          <TouchableOpacity
            onPress={onClose}
            accessibilityLabel="Close"
            hitSlop={12}
            style={styles.close}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
            <Text style={[styles.closeText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={[styles.title, { color: colors.text }]}>{TERMS_OF_USE.title}</Text>
        <Text style={[styles.updated, { color: colors.textSecondary }]}>
          {readOnly ? TERMS_OF_USE.updated : 'Please read and accept these terms to continue.'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.column}>
          {TERMS_OF_USE.intro.map((p) => (
            <Text key={p} style={bodyText}>
              {p}
            </Text>
          ))}
          {TERMS_OF_USE.sections.map((section) => (
            <View key={section.heading}>
              <Text style={[styles.heading, { color: colors.text }]}>{section.heading}</Text>
              {section.paragraphs?.map((p) => (
                <Text key={p} style={bodyText}>
                  {p}
                </Text>
              ))}
              {section.bullets?.map((b) => (
                <View key={b} style={styles.bullet}>
                  <Text style={bodyText}>{'•'}</Text>
                  <Text style={[bodyText, styles.bulletText]}>{b}</Text>
                </View>
              ))}
              {section.closing?.map((p) => (
                <Text key={p} style={bodyText}>
                  {p}
                </Text>
              ))}
            </View>
          ))}
          {!readOnly ? (
            <Text style={[styles.updated, styles.footnote, { color: colors.textSecondary }]}>
              {TERMS_OF_USE.updated}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      {!readOnly ? (
        <View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + 16, borderColor: colors.border, backgroundColor: colors.background },
          ]}
        >
          <View style={styles.column}>
            <Button
              title="I agree"
              onPress={onAgree}
              isValid
              isSubmitting={submitting}
              style={styles.agree}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  close: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginLeft: -8, marginBottom: 4 },
  closeText: { fontSize: 16 },
  title: { fontSize: 22, fontWeight: '600' },
  updated: { fontSize: 13, marginTop: 2, textAlign: 'center' },
  content: { paddingHorizontal: 24, paddingVertical: 16 },
  // Readable line length on tablets
  column: { width: '100%', maxWidth: 640, alignSelf: 'center' },
  heading: { fontSize: 16, marginTop: 18, marginBottom: 6, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, marginBottom: 8 },
  bullet: { flexDirection: 'row', paddingLeft: 4 },
  bulletText: { flex: 1, marginLeft: 8 },
  footnote: { marginTop: 12 },
  footer: { paddingHorizontal: 24, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  agree: { marginTop: 0 },
});
