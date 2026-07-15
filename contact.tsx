import React, { useCallback } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientBackground } from '@/components/GradientBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ContactActionButtons } from '@/components/ContactActionButtons';
import { useColors } from '@/hooks/useColors';
import { CALL_URL, PHONE_DISPLAY, WHATSAPP_URL } from '@/constants/contact';
import { TAB_BAR_CLEARANCE } from '@/constants/layout';

export default function ContactScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const openLink = useCallback(async (url: string, label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert('تعذر فتح', `لا يمكن فتح ${label} على هذا الجهاز.`);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert('تعذر فتح', `حدث خطأ أثناء فتح ${label}.`);
    }
  }, []);

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_CLEARANCE,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="تواصل معنا"
          subtitle="نرد على استفساراتك خلال دقائق عبر الاتصال المباشر أو واتساب"
        />

        <View style={styles.section}>
          <Pressable
            testID="contact-phone-row"
            onPress={() => openLink(CALL_URL, 'تطبيق الاتصال')}
            style={[
              styles.contactRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[styles.iconWrap, { backgroundColor: colors.secondary }]}
            >
              <Ionicons name="call" size={20} color={colors.accent} />
            </View>
            <View style={styles.contactTextWrap}>
              <Text style={[styles.contactLabel, { color: colors.mutedForeground }]}>
                رقم التواصل
              </Text>
              <Text style={[styles.contactValue, { color: colors.cardForeground }]}>
                {PHONE_DISPLAY}
              </Text>
            </View>
            <Ionicons
              name="chevron-back-outline"
              size={18}
              color={colors.mutedForeground}
            />
          </Pressable>

          <Pressable
            testID="contact-whatsapp-row"
            onPress={() => openLink(WHATSAPP_URL, 'واتساب')}
            style={[
              styles.contactRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[styles.iconWrap, { backgroundColor: colors.secondary }]}
            >
              <Ionicons name="logo-whatsapp" size={20} color={colors.success} />
            </View>
            <View style={styles.contactTextWrap}>
              <Text style={[styles.contactLabel, { color: colors.mutedForeground }]}>
                واتساب
              </Text>
              <Text style={[styles.contactValue, { color: colors.cardForeground }]}>
                {PHONE_DISPLAY}
              </Text>
            </View>
            <Ionicons
              name="chevron-back-outline"
              size={18}
              color={colors.mutedForeground}
            />
          </Pressable>
        </View>

        <View style={styles.ctaWrap}>
          <ContactActionButtons layout="column" />
        </View>

        <View
          style={[
            styles.noteCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="time-outline"
            size={18}
            color={colors.accent}
            style={styles.noteIcon}
          />
          <Text style={[styles.noteText, { color: colors.mutedForeground }]}>
            متاح للرد على استفساراتك يوميًا. لا تتردد في التواصل بخصوص أي
            مخاوف تتعلق بأمان حساباتك أو مشروعك الرقمي.
          </Text>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextWrap: {
    flex: 1,
    gap: 3,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  contactValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ctaWrap: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  noteCard: {
    flexDirection: 'row-reverse',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  noteIcon: {
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 19,
  },
});
