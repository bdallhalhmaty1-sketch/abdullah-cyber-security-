# Cyber Shield App — Source Code Export

## `app/_layout.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import * as Font from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// On web, expo-font detects a loaded @font-face via FontFaceObserver, which
// rejects if the font hasn't applied within its internal ~6s window (slow
// proxied networks, ad-blockers, etc). That rejection must never be allowed
// to block first paint indefinitely, so we race it against a safety timeout
// and always proceed — falling back to the system font if needed — instead
// of leaving the app stuck behind the splash screen.
const FONT_LOAD_SAFETY_TIMEOUT_MS = 8000;

function loadAppFonts() {
  return Font.loadAsync({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.race([loadAppFonts(), delay(FONT_LOAD_SAFETY_TIMEOUT_MS)])
      .catch((error) => {
        // Font loading/observing failed (e.g. fontfaceobserver timeout) —
        // log it and continue with the system font rather than crashing.
        console.warn('[fonts] Custom fonts failed to load, using fallback font.', error);
      })
      .finally(() => {
        if (isMounted) setFontsReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <StatusBar style="light" />
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

```

## `app/+not-found.tsx`

```tsx
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export default function NotFoundScreen() {
  const colors = useColors();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          This screen doesn&apos;t exist.
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: colors.primary }]}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
  },
});

```

## `app/(tabs)/about.tsx`

```tsx
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

```

## `app/(tabs)/contact.tsx`

```tsx
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

```

## `app/(tabs)/index.tsx`

```tsx
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

```

## `app/(tabs)/_layout.tsx`

```tsx
import React from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';

// IMPORTANT: iOS 26 uses NativeTabs for native tabs with liquid glass support.
// NativeTabs intentionally does NOT use custom design tokens — liquid glass
// is a system-level appearance provided by iOS and cannot be overridden.
// Custom brand colors are applied only on the ClassicTabLayout path (older iOS / Android / web).
function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>الرئيسية</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="services">
        <Icon sf={{ default: 'shield', selected: 'shield.fill' }} />
        <Label>الخدمات</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tips">
        <Icon sf={{ default: 'lightbulb', selected: 'lightbulb.fill' }} />
        <Label>نصائح</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="about">
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
        <Label>من نحن</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="contact">
        <Icon sf={{ default: 'bubble.left', selected: 'bubble.left.fill' }} />
        <Label>تواصل</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.card },
              ]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={22} />
            ) : (
              <Feather name="home" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'الخدمات',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="shield" tintColor={color} size={22} />
            ) : (
              <Feather name="shield" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: 'نصائح',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="lightbulb" tintColor={color} size={22} />
            ) : (
              <Feather name="zap" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'من نحن',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person" tintColor={color} size={22} />
            ) : (
              <Feather name="user" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'تواصل',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="bubble.left" tintColor={color} size={22} />
            ) : (
              <Feather name="message-circle" size={20} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}

```

## `app/(tabs)/services.tsx`

```tsx
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

```

## `app/(tabs)/tips.tsx`

```tsx
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

```

## `components/BrandMark.tsx`

```tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';

interface BrandMarkProps {
  size?: number;
}

/**
 * The shield-and-lock brand mark used across headers and the home hero.
 * Rendered as a gradient ring with a glassy inner circle so it reads as a
 * premium, glowing badge rather than a flat icon.
 */
export function BrandMark({ size = 64 }: BrandMarkProps) {
  const colors = useColors();
  const iconSize = size * 0.46;
  const innerSize = size - 6;

  return (
    <LinearGradient
      colors={colors.gradients.accent}
      style={[
        styles.ring,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: colors.card,
          },
        ]}
      >
        <Ionicons
          name="shield-checkmark"
          size={iconSize}
          color={colors.accent}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

```

## `components/ContactActionButtons.tsx`

```tsx
import React, { useCallback } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { CALL_URL, WHATSAPP_URL } from '@/constants/contact';

interface ContactActionButtonsProps {
  layout?: 'row' | 'column';
}

/**
 * The primary "call now" + "WhatsApp" action pair used across Home,
 * Services, and the Contact screen.
 */
export function ContactActionButtons({
  layout = 'row',
}: ContactActionButtonsProps) {
  const colors = useColors();

  const openLink = useCallback(async (url: string, label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
    <View style={layout === 'row' ? styles.row : styles.column}>
      <Pressable
        testID="call-button"
        onPress={() => openLink(CALL_URL, 'تطبيق الاتصال')}
        style={styles.buttonWrap}
      >
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Ionicons
            name="call"
            size={20}
            color={colors.primaryForeground}
          />
          <Text
            style={[styles.buttonText, { color: colors.primaryForeground }]}
          >
            اتصل الآن
          </Text>
        </LinearGradient>
      </Pressable>

      <Pressable
        testID="whatsapp-button"
        onPress={() => openLink(WHATSAPP_URL, 'واتساب')}
        style={styles.buttonWrap}
      >
        <LinearGradient
          colors={['#22d3a4', '#00b894']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Ionicons
            name="logo-whatsapp"
            size={20}
            color={colors.successForeground}
          />
          <Text
            style={[styles.buttonText, { color: colors.successForeground }]}
          >
            واتساب
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flexDirection: 'column',
    gap: 12,
  },
  buttonWrap: {
    flex: 1,
  },
  button: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
});

```

## `components/ErrorBoundary.tsx`

```tsx
import React, { Component, ComponentType, PropsWithChildren } from 'react';
import { ErrorFallback, ErrorFallbackProps } from '@/components/ErrorFallback';

export type ErrorBoundaryProps = PropsWithChildren<{
  FallbackComponent?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, stackTrace: string) => void;
}>;

type ErrorBoundaryState = { error: Error | null };

/**
 * This is a special case for for using the class components. Error boundaries must be class components because React only provides error boundary functionality through lifecycle methods (componentDidCatch and getDerivedStateFromError) which are not available in functional components.
 * https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static defaultProps: {
    FallbackComponent: ComponentType<ErrorFallbackProps>;
  } = {
    FallbackComponent: ErrorFallback,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, info.componentStack);
    }
  }

  resetError = (): void => {
    this.setState({ error: null });
  };

  render() {
    const { FallbackComponent } = this.props;

    return this.state.error && FallbackComponent ? (
      <FallbackComponent
        error={this.state.error}
        resetError={this.resetError}
      />
    ) : (
      this.props.children
    );
  }
}

```

## `components/ErrorFallback.tsx`

```tsx
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { reloadAppAsync } from 'expo';

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRestart = async () => {
    try {
      await reloadAppAsync();
    } catch (restartError) {
      console.error('Failed to restart app:', restartError);
      resetError();
    }
  };

  const formatErrorDetails = (): string => {
    let details = `Error: ${error.message}\n\n`;
    if (error.stack) {
      details += `Stack Trace:\n${error.stack}`;
    }
    return details;
  };

  const monoFont = Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {__DEV__ ? (
        <Pressable
          onPress={() => setIsModalVisible(true)}
          accessibilityLabel="View error details"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.topButton,
            {
              top: insets.top + 16,
              backgroundColor: colors.card,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Feather name="alert-circle" size={20} color={colors.foreground} />
        </Pressable>
      ) : null}

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Something went wrong
        </Text>

        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          Please reload the app to continue.
        </Text>

        <Pressable
          onPress={handleRestart}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Text
            style={[styles.buttonText, { color: colors.primaryForeground }]}
          >
            Try Again
          </Text>
        </Pressable>
      </View>

      {__DEV__ ? (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  Error Details
                </Text>
                <Pressable
                  onPress={() => setIsModalVisible(false)}
                  accessibilityLabel="Close error details"
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.closeButton,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <Feather name="x" size={24} color={colors.foreground} />
                </Pressable>
              </View>

              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={[
                  styles.modalScrollContent,
                  { paddingBottom: insets.bottom + 16 },
                ]}
                showsVerticalScrollIndicator
              >
                <View
                  style={[
                    styles.errorContainer,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <Text
                    style={[
                      styles.errorText,
                      {
                        color: colors.foreground,
                        fontFamily: monoFont,
                      },
                    ]}
                    selectable
                  >
                    {formatErrorDetails()}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 600,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 40,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  topButton: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    paddingHorizontal: 24,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    height: '90%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 16,
  },
  errorContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 16,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    width: '100%',
  },
});

```

## `components/GradientBackground.tsx`

```tsx
import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';

/**
 * Full-screen navy → deep-blue gradient with a soft cyan glow accent.
 * Used as the base background for every screen to keep the cybersecurity
 * brand consistent.
 */
export function GradientBackground({ children, style, ...rest }: ViewProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, style]} {...rest}>
      <LinearGradient
        colors={colors.gradients.hero}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[styles.glow, { backgroundColor: colors.accent }]}
      />
      <View
        pointerEvents="none"
        style={[styles.glowSecondary, { backgroundColor: colors.violet }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    top: -140,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.1,
  },
  glowSecondary: {
    position: 'absolute',
    bottom: -160,
    left: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.08,
  },
});

```

## `components/KeyboardAwareScrollViewCompat.tsx`

```tsx
import { Platform, ScrollView, ScrollViewProps } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';

type Props = KeyboardAwareScrollViewProps & ScrollViewProps;

export function KeyboardAwareScrollViewCompat({
  children,
  keyboardShouldPersistTaps = 'handled',
  ...props
}: Props) {
  if (Platform.OS === 'web') {
    return (
      <ScrollView
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

```

## `components/ScreenHeader.tsx`

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { BrandMark } from './BrandMark';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  compact?: boolean;
}

/**
 * Shared top header for tab screens (headers are hidden at the navigator
 * level so each screen fully controls its own hero area).
 */
export function ScreenHeader({ title, subtitle, compact }: ScreenHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 16 },
        compact && styles.compact,
      ]}
    >
      {!compact && (
        <View style={styles.brandRow}>
          <BrandMark size={40} />
        </View>
      )}
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  compact: {
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row-reverse',
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 6,
    lineHeight: 20,
  },
});

```

## `components/SectionTitle.tsx`

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface SectionTitleProps {
  title: string;
  action?: React.ReactNode;
}

export function SectionTitle({ title, action }: SectionTitleProps) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      {action}
      <View style={styles.titleWrap}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {title}
        </Text>
        <View style={[styles.underline, { backgroundColor: colors.accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleWrap: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 19,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  underline: {
    width: 28,
    height: 3,
    borderRadius: 2,
    marginTop: 6,
  },
});

```

## `components/ServiceCard.tsx`

```tsx
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import type { CyberService } from '@/constants/services';

interface ServiceCardProps {
  service: CyberService;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const colors = useColors();
  const [pressed, setPressed] = useState(false);

  const handlePressIn = useCallback(() => {
    setPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handlePressOut = useCallback(() => setPressed(false), []);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={`service-card-${service.id}`}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.headerRow}>
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconWrap}
        >
          <Ionicons name={service.icon} size={22} color="#1a1300" />
        </LinearGradient>
        <View
          style={[
            styles.indexBadge,
            { borderColor: colors.border },
          ]}
        >
          <Text style={[styles.indexText, { color: colors.mutedForeground }]}>
            {String(index + 1).padStart(2, '0')}
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: colors.cardForeground }]}>
        {service.title}
      </Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>
        {service.description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  indexText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 20,
  },
});

```

## `components/StatBadge.tsx`

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface StatBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

export function StatBadge({ icon, label }: StatBadgeProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Ionicons name={icon} size={16} color={colors.accent} />
      <Text
        style={[styles.label, { color: colors.cardForeground }]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

```

## `components/TipItem.tsx`

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import type { SecurityTip } from '@/constants/tips';

interface TipItemProps {
  tip: SecurityTip;
  index: number;
}

export function TipItem({ tip, index }: TipItemProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <LinearGradient
        colors={colors.gradients.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconWrap}
      >
        <Ionicons name={tip.icon} size={18} color="#1a1300" />
      </LinearGradient>
      <Text style={[styles.text, { color: colors.cardForeground }]}>
        {tip.title}
      </Text>
      <Text style={[styles.index, { color: colors.mutedForeground }]}>
        {String(index + 1).padStart(2, '0')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 20,
  },
  index: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
});

```

## `constants/colors.ts`

```ts
/**
 * Semantic design tokens for the mobile app.
 *
 * Brand: black & neon gold — a high-contrast, premium cybersecurity look.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#faf6ec',
    tint: '#ffcc33',

    // Core surfaces — near-black onyx
    background: '#050503',
    foreground: '#faf6ec',

    // Cards / elevated surfaces
    card: '#121110',
    cardForeground: '#f5efdd',

    // Primary action color (buttons, links, active states) — neon gold
    primary: '#ffc933',
    primaryForeground: '#1a1300',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#1c1a15',
    secondaryForeground: '#e7d9b0',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#181613',
    mutedForeground: '#9b927d',

    // Accent highlights (badges, selected items, focus rings) — bright neon gold
    accent: '#ffd84d',
    accentForeground: '#1a1300',

    // Destructive actions (delete, error states)
    destructive: '#ff5468',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#2a2620',
    input: '#1c1a15',

    // Success / positive confirmation (WhatsApp, verified states)
    success: '#25d366',
    successForeground: '#04140b',

    // Secondary accent — deep bronze, used to add depth to gradients
    violet: '#8a6a1f',
  },

  // Reusable gradient stops for buttons, brand mark, and hero backgrounds.
  gradients: {
    primary: ['#ffd84d', '#c9922b'] as const,
    accent: ['#ffe98a', '#ffb300'] as const,
    hero: ['#000000', '#0c0a06', '#000000'] as const,
    danger: ['#ff5468', '#ff8a5b'] as const,
  },

  // Border radius (in px). Cybersecurity brand uses soft-square cards.
  radius: 16,
};

export default colors;

```

## `constants/contact.ts`

```ts
/**
 * Owner + contact constants used across the app.
 */
export const OWNER_NAME = 'عبدالله الحماطي';
export const OWNER_ROLE = 'مختص الأمن السيبراني والرقمي';

// Displayed exactly as provided.
export const PHONE_DISPLAY = '783044700';

// Used for tel: / wa.me deep links (Yemen country code).
export const PHONE_INTL = '+967783044700';
export const WHATSAPP_INTL = '967783044700';

export const WHATSAPP_DEFAULT_MESSAGE =
  'السلام عليكم، أرغب في الاستفسار عن خدمات الأمن السيبراني.';

export const CALL_URL = `tel:${PHONE_INTL}`;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(
  WHATSAPP_DEFAULT_MESSAGE,
)}`;

```

## `constants/layout.ts`

```ts
/**
 * Extra bottom clearance to add to scrollable content so the last item is
 * never hidden behind the floating tab bar.
 */
export const TAB_BAR_CLEARANCE = 100;

```

## `constants/services.ts`

```ts
import type { Ionicons } from '@expo/vector-icons';

export interface CyberService {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export const SERVICES: CyberService[] = [
  {
    id: 'account-protection',
    icon: 'lock-closed-outline',
    title: 'حماية الحسابات الرقمية',
    description:
      'تأمين حساباتك على البريد الإلكتروني ومواقع التواصل والمنصات الرقمية من الاختراق والوصول غير المصرح به.',
  },
  {
    id: 'web-app-security',
    icon: 'globe-outline',
    title: 'تأمين المواقع والتطبيقات',
    description:
      'تدقيق وتحصين المواقع والتطبيقات ضد الهجمات الإلكترونية وأبرز الثغرات الشائعة.',
  },
  {
    id: 'vulnerability-scan',
    icon: 'bug-outline',
    title: 'فحص الثغرات الأمنية',
    description:
      'اختبار اختراق شامل لاكتشاف نقاط الضعف وإغلاقها قبل أن يستغلها المهاجمون.',
  },
  {
    id: 'consulting',
    icon: 'chatbubbles-outline',
    title: 'استشارات الأمن السيبراني',
    description:
      'استشارات متخصصة لبناء استراتيجية حماية رقمية تناسب طبيعة عملك واحتياجاتك.',
  },
  {
    id: 'data-privacy',
    icon: 'shield-checkmark-outline',
    title: 'حماية البيانات والخصوصية',
    description:
      'حلول لتشفير البيانات وحماية خصوصية معلوماتك الحساسة من التسريب أو الاستغلال.',
  },
  {
    id: 'fraud-awareness',
    icon: 'megaphone-outline',
    title: 'التوعية ضد الاحتيال الإلكتروني',
    description:
      'برامج تدريبية وتوعوية لحماية فريقك وعائلتك من عمليات الاحتيال والاصطياد الرقمي.',
  },
];

```

## `constants/tips.ts`

```ts
import type { Ionicons } from '@expo/vector-icons';

export interface SecurityTip {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}

export const SECURITY_TIPS: SecurityTip[] = [
  {
    id: 'two-factor',
    icon: 'key-outline',
    title: 'فعّل التحقق بخطوتين على جميع حساباتك المهمة',
  },
  {
    id: 'unknown-links',
    icon: 'link-outline',
    title: 'لا تنقر على روابط مجهولة المصدر ترد عبر الرسائل أو البريد',
  },
  {
    id: 'strong-passwords',
    icon: 'lock-closed-outline',
    title: 'استخدم كلمات مرور قوية ومختلفة لكل حساب',
  },
  {
    id: 'updates',
    icon: 'refresh-outline',
    title: 'حدّث نظام التشغيل والتطبيقات بشكل دوري لإغلاق الثغرات',
  },
  {
    id: 'public-wifi',
    icon: 'wifi-outline',
    title: 'تجنب إجراء عمليات حساسة عبر شبكات Wi-Fi عامة غير موثوقة',
  },
  {
    id: 'backups',
    icon: 'cloud-upload-outline',
    title: 'احتفظ بنسخة احتياطية من بياناتك المهمة بشكل دوري',
  },
  {
    id: 'otp',
    icon: 'shield-outline',
    title: 'لا تشارك رموز التحقق (OTP) مع أي شخص مهما كان',
  },
  {
    id: 'verify-links',
    icon: 'search-outline',
    title: 'تحقق من صحة الروابط والمواقع قبل إدخال بياناتك الشخصية',
  },
];

```

## `hooks/useColors.ts`

```ts
import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';

/**
 * Returns the design tokens for the current color scheme.
 *
 * The returned object contains all color tokens for the active palette
 * plus scheme-independent values like `radius`.
 *
 * Falls back to the light palette when no dark key is defined in
 * constants/colors.ts (the scaffold ships light-only by default).
 * When a sibling web artifact's dark tokens are synced into a `dark`
 * key, this hook will automatically switch palettes based on the
 * device's appearance setting.
 */
export function useColors() {
  const scheme = useColorScheme();
  const palette =
    scheme === 'dark' && 'dark' in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;
  return { ...palette, radius: colors.radius, gradients: colors.gradients };
}

```

