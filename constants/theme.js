/** LoreForge literary dark theme */
export const colors = {
  background: '#121B22',
  surface: '#1A2830',
  surfaceElevated: '#4A6D77',
  surfaceCard: '#243038',
  surfaceInset: '#0E1519',
  border: '#2E4048',
  borderLight: '#3D5560',
  primary: '#5A848E',
  primaryDark: '#3D5A62',
  primaryMuted: '#4A6D77',
  gold: '#C5B358',
  goldMuted: '#A8956A',
  text: '#E8E4DC',
  textSecondary: '#B0BEC5',
  textMuted: '#7A8F98',
  success: '#22C55E',
  error: '#EF4444',
  outputText: '#B8C9D0',
  tabBar: '#0E1519',
  cardGradientStart: '#4A6D77',
  cardGradientEnd: '#2A4249',
};

export const fonts = {
  serif: 'Cinzel_600SemiBold',
  serifBold: 'Cinzel_700Bold',
  body: 'Lora_400Regular',
  bodyItalic: 'Lora_400Regular_Italic',
  bodySemi: 'Lora_600SemiBold',
};

export const categoryMeta = {
  magic: { label: 'Magic', color: '#A855F7', icon: 'wand' },
  society: { label: 'Society', color: '#EF4444', icon: 'account-group' },
  geography: { label: 'Geography', color: '#3B82F6', icon: 'earth' },
  history: { label: 'History', color: '#EAB308', icon: 'book-open-variant' },
  tech: { label: 'Tech', color: '#06B6D4', icon: 'cog' },
  politics: { label: 'Politics', color: '#F97316', icon: 'bank' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const paperTheme = {
  dark: true,
  roundness: radius.md,
  colors: {
    primary: colors.primary,
    onPrimary: colors.text,
    primaryContainer: colors.primaryDark,
    onPrimaryContainer: colors.text,
    secondary: colors.gold,
    onSecondary: colors.background,
    background: colors.background,
    onBackground: colors.text,
    surface: colors.surface,
    onSurface: colors.text,
    surfaceVariant: colors.surfaceCard,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.border,
    error: colors.error,
    elevation: {
      level0: 'transparent',
      level1: colors.surface,
      level2: colors.surfaceCard,
      level3: colors.surfaceCard,
      level4: colors.surfaceCard,
      level5: colors.surfaceCard,
    },
  },
};
