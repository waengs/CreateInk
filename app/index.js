import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import LoadingScreen from '../components/LoadingScreen';
import { useAppFonts } from '../constants/fonts';
import { useLoreStore } from '../store/useLoreStore';

const MIN_MS = 1800;

export default function SplashRoute() {
  const router = useRouter();
  const fontsLoaded = useAppFonts();
  const [hydrated, setHydrated] = useState(
    () => useLoreStore.persist.hasHydrated()
  );
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), MIN_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const unsub = useLoreStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated && minElapsed && fontsLoaded) {
      router.replace('/(tabs)');
    }
  }, [hydrated, minElapsed, fontsLoaded, router]);

  return <LoadingScreen />;
}
