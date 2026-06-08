import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import { Text } from 'react-native-paper';
import {
  RELATIONSHIP_TYPES,
} from '../../constants/relationships';
import { colors, fonts, radius, spacing } from '../../constants/theme';
import {
  buildGraphScene,
} from '../../utils/relationshipGraphGeometry';

const PREVIEW_BASE_H = 200;
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 4;

function previewHeight(charCount) {
  return Math.min(340, Math.max(PREVIEW_BASE_H, PREVIEW_BASE_H + charCount * 10));
}

function GraphSvg({ characters, relationships, width, height }) {
  const { nodes, labelSize, edges } = useMemo(
    () => buildGraphScene(characters, relationships, width, height),
    [characters, relationships, width, height]
  );

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G>
        {edges.map((edge) => (
          <Path
            key={`line-${edge.key}`}
            d={edge.line}
            stroke={edge.color}
            strokeWidth={edge.strokeWidth ?? 3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {nodes.map((n) => (
          <Circle
            key={`node-${n.id}`}
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill={colors.surfaceCard}
            stroke={colors.borderLight}
            strokeWidth={1.5}
          />
        ))}

        {nodes.map((n) => (
          <SvgText
            key={`label-${n.id}`}
            x={n.cx}
            y={n.cy + labelSize * 0.35}
            fill={colors.text}
            fontSize={labelSize}
            fontWeight="600"
            textAnchor="middle"
          >
            {(n.name || '?').slice(0, Math.max(4, Math.floor(n.r / 3)))}
          </SvgText>
        ))}

        {edges.map((edge) => (
          <Path
            key={`head-${edge.key}`}
            d={edge.head.d}
            fill={edge.head.color}
            stroke={edge.head.color}
            strokeWidth={0.5}
          />
        ))}
      </G>
    </Svg>
  );
}

function ZoomableCanvas({
  width,
  height,
  zoom,
  onZoomChange,
  pan,
  onPanChange,
  children,
}) {
  const pinchBase = useRef(1);
  const panBase = useRef({ x: 0, y: 0 });
  const panRef = useRef(null);
  const pinchRef = useRef(null);

  useEffect(() => {
    pinchBase.current = zoom;
  }, [zoom]);

  useEffect(() => {
    panBase.current = pan;
  }, [pan]);

  const clampZoom = (v) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v));

  const onPinchEvent = (e) => {
    onZoomChange(clampZoom(pinchBase.current * e.nativeEvent.scale));
  };

  const onPinchStateChange = (e) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      const next = clampZoom(pinchBase.current * e.nativeEvent.scale);
      pinchBase.current = next;
      onZoomChange(next);
    }
  };

  const onPanEvent = (e) => {
    onPanChange({
      x: panBase.current.x + e.nativeEvent.translationX,
      y: panBase.current.y + e.nativeEvent.translationY,
    });
  };

  const onPanStateChange = (e) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      const next = {
        x: panBase.current.x + e.nativeEvent.translationX,
        y: panBase.current.y + e.nativeEvent.translationY,
      };
      panBase.current = next;
      onPanChange(next);
    }
  };

  return (
    <PanGestureHandler
      ref={panRef}
      simultaneousHandlers={pinchRef}
      onGestureEvent={onPanEvent}
      onHandlerStateChange={onPanStateChange}
      minPointers={1}
      maxPointers={1}
    >
      <PinchGestureHandler
        ref={pinchRef}
        simultaneousHandlers={panRef}
        onGestureEvent={onPinchEvent}
        onHandlerStateChange={onPinchStateChange}
      >
        <View style={styles.zoomArea} collapsable={false}>
          <View
            style={[
              styles.scaledCanvas,
              {
                width,
                height,
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                  { scale: zoom },
                ],
              },
            ]}
          >
            {children}
          </View>
        </View>
      </PinchGestureHandler>
    </PanGestureHandler>
  );
}

function Legend() {
  return (
    <View style={styles.legend}>
      {RELATIONSHIP_TYPES.map((t) => (
        <View key={t.key} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: t.color }]} />
          <Text style={styles.legendLabel}>{t.label}</Text>
        </View>
      ))}
    </View>
  );
}

export default function RelationshipGraph({
  characters,
  relationships,
  width,
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const previewH = previewHeight(characters.length);
  const fullSize = Dimensions.get('window').width - spacing.md * 2;

  const openFullscreen = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setFullscreen(true);
  };

  if (characters.length < 2) {
    return (
      <View style={[styles.emptyBox, { width }]}>
        <Text style={styles.emptyText}>
          Add at least two characters to see the relationship graph.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Pressable style={styles.previewWrap} onPress={openFullscreen}>
        <View style={[styles.previewBox, { width }]}>
          <GraphSvg
            characters={characters}
            relationships={relationships}
            width={width}
            height={previewH}
          />
          <View style={styles.expandHint}>
            <MaterialCommunityIcons name="fullscreen" size={16} color={colors.gold} />
            <Text style={styles.expandText}>Tap to expand</Text>
          </View>
        </View>
        <Legend />
      </Pressable>

      <Modal
        visible={fullscreen}
        animationType="slide"
        onRequestClose={() => setFullscreen(false)}
      >
        <GestureHandlerRootView style={styles.modalRoot}>
          <SafeAreaView style={styles.fullSafe}>
            <View style={styles.fullHeader}>
              <Text style={styles.fullTitle}>Relationship Graph</Text>
              <View style={styles.zoomRow}>
                <TouchableOpacity
                  style={styles.zoomBtn}
                  onPress={() =>
                    setZoom((z) => Math.max(z - 0.25, MIN_ZOOM))
                  }
                >
                  <MaterialCommunityIcons name="minus" size={20} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.zoomLabel}>{Math.round(zoom * 100)}%</Text>
                <TouchableOpacity
                  style={styles.zoomBtn}
                  onPress={() =>
                    setZoom((z) => Math.min(z + 0.25, MAX_ZOOM))
                  }
                >
                  <MaterialCommunityIcons name="plus" size={20} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFullscreen(false)}>
                  <MaterialCommunityIcons name="close" size={26} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <ZoomableCanvas
              width={fullSize}
              height={fullSize}
              zoom={zoom}
              onZoomChange={setZoom}
              pan={pan}
              onPanChange={setPan}
            >
              <GraphSvg
                characters={characters}
                relationships={relationships}
                width={fullSize}
                height={fullSize}
              />
            </ZoomableCanvas>

            <Legend />
            <Text style={styles.hint}>
              Drag to pan · pinch or +/- to zoom · arrows attach at node rims
            </Text>
          </SafeAreaView>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  previewWrap: {
    marginBottom: spacing.sm,
  },
  previewBox: {
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  modalRoot: {
    flex: 1,
  },
  zoomArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scaledCanvas: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surfaceCard,
  },
  expandText: {
    fontFamily: fonts.bodySemi,
    color: colors.gold,
    fontSize: 12,
  },
  emptyBox: {
    height: PREVIEW_BASE_H,
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 11,
  },
  hint: {
    fontFamily: fonts.body,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fullSafe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  fullHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  fullTitle: {
    flex: 1,
    fontFamily: fonts.serifBold,
    color: colors.text,
    fontSize: 18,
  },
  zoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  zoomBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomLabel: {
    fontFamily: fonts.bodySemi,
    color: colors.textSecondary,
    fontSize: 12,
    minWidth: 42,
    textAlign: 'center',
  },
});
