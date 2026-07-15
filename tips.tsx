import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/GradientBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TipItem } from '@/components/TipItem';
import { SECURITY_TIPS } from '@/constants/tips';
import { TAB_BAR_CLEARANCE } from '@/constants/layout';

export default function TipsScreen() {
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
          title="نصائح أمنية"
          subtitle="خطوات بسيطة تحميك يوميًا من أكثر التهديدات الرقمية شيوعًا"
        />
        <View style={styles.list}>
          {SECURITY_TIPS.map((tip, index) => (
            <TipItem key={tip.id} tip={tip} index={index} />
          ))}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    gap: 10,
  },
});
