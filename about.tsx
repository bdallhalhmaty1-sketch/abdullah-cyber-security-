import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/GradientBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { BrandMark } from '@/components/BrandMark';
import { ContactActionButtons } from '@/components/ContactActionButtons';
import { useColors } from '@/hooks/useColors';
import { OWNER_NAME, OWNER_ROLE } from '@/constants/contact';
import { TAB_BAR_CLEARANCE } from '@/constants/layout';

const VALUES: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string }[] = [
  {
    icon: 'ribbon-outline',
    title: 'خبرة موثوقة',
    description: 'تعامل مباشر مع خبير متخصص في الأمن السيبراني والرقمي.',
  },
  {
    icon: 'eye-off-outline',
    title: 'سرية تامة',
    description: 'كل معلوماتك وبياناتك تُعامل بخصوصية وسرية كاملة.',
  },
  {
    icon: 'flash-outline',
    title: 'استجابة سريعة',
    description: 'رد سريع على استفساراتك وطلباتك عبر الاتصال أو واتساب.',
  },
  {
    icon: 'construct-outline',
    title: 'حلول مخصصة',
    description: 'كل خدمة تُصمم بما يناسب طبيعة حسابك أو مشروعك أو موقعك.',
  },
];

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_CLEARANCE,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="من نحن" compact />

        <View style={styles.profile}>
          <BrandMark size={72} />
          <Text style={[styles.name, { color: colors.foreground }]}>
            {OWNER_NAME}
          </Text>
          <Text style={[styles.role, { color: colors.accent }]}>
            {OWNER_ROLE}
          </Text>
        </View>

        <View
          style={[
            styles.bioCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.bio, { color: colors.cardForeground }]}>
            أقدّم خدمات متخصصة في الأمن السيبراني والرقمي تشمل حماية
            الحسابات، تأمين المواقع والتطبيقات، فحص الثغرات، وتقديم
            الاستشارات الأمنية للأفراد والشركات. هدفي أن تشعر بالأمان
            الرقمي في كل ما تملكه من حسابات وبيانات ومنصات، من خلال حلول
            عملية وواضحة ومتابعة مستمرة.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            لماذا تختارنا
          </Text>
          <View style={styles.valuesList}>
            {VALUES.map((value) => (
              <View
                key={value.title}
                style={[
                  styles.valueRow,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.valueIcon,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <Ionicons
                    name={value.icon}
                    size={20}
                    color={colors.accent}
                  />
                </View>
                <View style={styles.valueTextWrap}>
                  <Text
                    style={[styles.valueTitle, { color: colors.cardForeground }]}
                  >
                    {value.title}
                  </Text>
                  <Text
                    style={[
                      styles.valueDescription,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {value.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaWrap}>
          <ContactActionButtons />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginTop: 10,
  },
  role: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  bioCard: {
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 24,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 23,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  valuesList: {
    gap: 10,
  },
  valueRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  valueIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueTextWrap: {
    flex: 1,
    gap: 4,
  },
  valueTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  valueDescription: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 19,
  },
  ctaWrap: {
    paddingHorizontal: 20,
  },
});
