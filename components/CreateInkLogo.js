import { Image, StyleSheet } from 'react-native';

const LOGO = require('../assets/CreateInk_logo.png');

export default function CreateInkLogo({ size = 48, style, imageStyle }) {
  return (
    <Image
      source={LOGO}
      style={[styles.image, { width: size, height: size }, style, imageStyle]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 48,
    height: 48,
  },
});
