import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/GradientBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ServiceCard } from '@/components/ServiceCard';
import { ContactActionButtons } from '@/components/ContactActionButtons';
import { useColors } from '@/hooks/useColors';
import { SERVICES } from '@/constants/services';
import { TAB_BAR_CLEARANCE } from '@/constants/layout';

export default function ServicesScreen() {
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
        <ScreenHeader
          title="خدماتنا"
          subtitle="حلول متكاملة لحماية أعمالك وحساباتك ومعلوماتك الحساسة"
        />
        <View style={styles.list}>
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </View>

        <View
          style={[
            styles.ctaCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.ctaTitle, { color: colors.cardForeground }]}>
            هل تحتاج مساعدة لاختيار الخدمة المناسبة؟
          </Text>
          <Text style={[styles.ctaSubtitle, { color: colors.mutedForeground }]}>
            تواصل الآن للحصول على استشارة سريعة ومجانية.
          </Text>
          <ContactActionButtons />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  ctaCard: {
    marginTop: 24,
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ctaSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 19,
  },
});
