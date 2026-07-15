import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/GradientBackground';
import { BrandMark } from '@/components/BrandMark';
import { StatBadge } from '@/components/StatBadge';
import { SectionTitle } from '@/components/SectionTitle';
import { ServiceCard } from '@/components/ServiceCard';
import { TipItem } from '@/components/TipItem';
import { ContactActionButtons } from '@/components/ContactActionButtons';
import { useColors } from '@/hooks/useColors';
import { SERVICES } from '@/constants/services';
import { SECURITY_TIPS } from '@/constants/tips';
import { OWNER_NAME, OWNER_ROLE } from '@/constants/contact';
import { TAB_BAR_CLEARANCE } from '@/constants/layout';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const previewServices = SERVICES.slice(0, 3);
  const dailyTip = SECURITY_TIPS[0];

  return (
    <GradientBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + TAB_BAR_CLEARANCE,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <BrandMark size={84} />
          <Text style={[styles.name, { color: colors.foreground }]}>
            {OWNER_NAME}
          </Text>
          <Text style={[styles.role, { color: colors.accent }]}>
            {OWNER_ROLE}
          </Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            حماية رقمية موثوقة لحساباتك، مواقعك، وبياناتك — قبل أن يستغل
            أحدهم ثغراتها.
          </Text>
        </View>

        <ContactActionButtons />

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBadge icon="shield-checkmark-outline" label="٦ خدمات متخصصة" />
          <StatBadge icon="flash-outline" label="استجابة سريعة" />
          <StatBadge icon="lock-closed-outline" label="سرية تامة" />
        </View>

        {/* Services preview */}
        <View style={styles.section}>
          <SectionTitle
            title="خدماتنا"
            action={
              <View
                style={[
                  styles.linkPill,
                  { borderColor: colors.border, backgroundColor: colors.card },
                ]}
              >
                <Text
                  onPress={() => router.push('/services')}
                  style={[styles.linkText, { color: colors.accent }]}
                  testID="see-all-services"
                >
                  عرض الكل
                </Text>
                <Ionicons
                  name="arrow-back-outline"
                  size={14}
                  color={colors.accent}
                />
              </View>
            }
          />
          <View style={styles.servicesList}>
            {previewServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </View>
        </View>

        {/* Tip of the day */}
        <View style={styles.section}>
          <SectionTitle
            title="نصيحة أمنية"
            action={
              <View
                style={[
                  styles.linkPill,
                  { borderColor: colors.border, backgroundColor: colors.card },
                ]}
              >
                <Text
                  onPress={() => router.push('/tips')}
                  style={[styles.linkText, { color: colors.accent }]}
                  testID="see-all-tips"
                >
                  جميع النصائح
                </Text>
                <Ionicons
                  name="arrow-back-outline"
                  size={14}
                  color={colors.accent}
                />
              </View>
            }
          />
          <TipItem tip={dailyTip} index={0} />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 28,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    marginTop: 14,
    textAlign: 'center',
  },
  role: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 21,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  section: {
    gap: 12,
  },
  servicesList: {
    gap: 12,
  },
  linkPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  linkText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
});
