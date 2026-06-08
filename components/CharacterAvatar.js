import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius } from '../constants/theme';

export function getInitials(name) {
  if (!name?.trim()) return '?';
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_GRADIENTS = [
  ['#1e3a5f', '#4DB6AC'],
  ['#312e81', '#7c3aed'],
  ['#134e4a', '#2dd4bf'],
  ['#4a1d6b', '#c084fc'],
  ['#1e293b', '#38bdf8'],
];

export function colorPairForName(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

export default function CharacterAvatar({
  name,
  imageUri,
  size = 48,
  style,
  large,
}) {
  const s = large ? size * 1.4 : size;
  const borderRadius = large ? radius.lg : radius.md;
  const boxStyle = {
    width: s,
    height: s,
    borderRadius,
  };

  if (imageUri) {
    return (
      <View style={[styles.clip, boxStyle, style]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.imageFill}
          resizeMode="cover"
        />
      </View>
    );
  }

  const [c1] = colorPairForName(name);

  return (
    <View
      style={[
        styles.wrap,
        boxStyle,
        { backgroundColor: c1 },
        style,
      ]}
    >
      <Text style={[styles.label, { fontSize: s * 0.32 }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceInset,
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  label: {
    color: colors.text,
    fontWeight: '700',
  },
});
