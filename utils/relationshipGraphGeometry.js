import {
  RELATIONSHIP_TYPES,
  relationshipColor,
} from '../constants/relationships';
import { colors } from '../constants/theme';

export function graphLayout(characters, width, height) {
  const count = characters.length;
  const nodeR = Math.max(18, Math.min(34, (Math.min(width, height) / count) * 0.42));
  const labelSize = Math.max(9, Math.min(11, nodeR * 0.32));
  const cx = width / 2;
  const cy = height / 2;
  const ringR = Math.min(width, height) * (0.22 + Math.min(count, 14) * 0.018);

  const nodes = characters.map((c, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      ...c,
      cx: cx + ringR * Math.cos(angle),
      cy: cy + ringR * Math.sin(angle),
      r: nodeR,
    };
  });

  return { nodes, labelSize };
}

function circleLineHit(cx, cy, r, lx1, ly1, lx2, ly2, towardX, towardY) {
  const dx = lx2 - lx1;
  const dy = ly2 - ly1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) {
    const angle = Math.atan2(towardY - cy, towardX - cx);
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  }

  const t = ((cx - lx1) * dx + (cy - ly1) * dy) / len2;
  const closestX = lx1 + t * dx;
  const closestY = ly1 + t * dy;
  const distSq = (closestX - cx) ** 2 + (closestY - cy) ** 2;

  if (distSq > r * r) {
    const angle = Math.atan2(towardY - cy, towardX - cx);
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  }

  const dt = Math.sqrt((r * r - distSq) / len2);
  const p1 = { x: lx1 + (t - dt) * dx, y: ly1 + (t - dt) * dy };
  const p2 = { x: lx1 + (t + dt) * dx, y: ly1 + (t + dt) * dy };
  const d1 = (p1.x - towardX) ** 2 + (p1.y - towardY) ** 2;
  const d2 = (p2.x - towardX) ** 2 + (p2.y - towardY) ** 2;
  return d1 < d2 ? p1 : p2;
}

function directedEdge(from, to, laneSign) {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const span = Math.hypot(dx, dy) || 1;
  const px = (-dy / span) * laneSign * Math.max(22, span * 0.1);
  const py = (dx / span) * laneSign * Math.max(22, span * 0.1);

  const lx1 = from.cx + px;
  const ly1 = from.cy + py;
  const lx2 = to.cx + px;
  const ly2 = to.cy + py;

  const start = circleLineHit(from.cx, from.cy, from.r, lx1, ly1, lx2, ly2, lx2, ly2);
  const end = circleLineHit(to.cx, to.cy, to.r, lx1, ly1, lx2, ly2, lx1, ly1);

  const lineDx = end.x - start.x;
  const lineDy = end.y - start.y;
  const angle = Math.atan2(lineDy, lineDx);

  return {
    sx: start.x,
    sy: start.y,
    ex: end.x,
    ey: end.y,
    angle,
    d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
  };
}

function arrowHead(edge, color) {
  const size = 16;
  const wing = 0.48;
  const { ex, ey, angle } = edge;
  const x1 = ex - size * Math.cos(angle - wing);
  const y1 = ey - size * Math.sin(angle - wing);
  const x2 = ex - size * Math.cos(angle + wing);
  const y2 = ey - size * Math.sin(angle + wing);
  return {
    d: `M ${ex} ${ey} L ${x1} ${y1} L ${x2} ${y2} Z`,
    color,
  };
}

export function buildGraphScene(characters, relationships, width, height) {
  const { nodes, labelSize } = graphLayout(characters, width, height);
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const edges = relationships.flatMap((rel) => {
    const a = nodeMap[rel.charAId];
    const b = nodeMap[rel.charBId];
    if (!a || !b) return [];

    const colorA = relationshipColor(rel.dynamicAToB);
    const colorB = relationshipColor(rel.dynamicBToA);
    const ab = directedEdge(a, b, 1);
    const ba = directedEdge(b, a, -1);

    return [
      {
        key: `${rel.id}-ab`,
        line: ab.d,
        head: arrowHead(ab, colorA),
        color: colorA,
        strokeWidth: 4,
      },
      {
        key: `${rel.id}-ba`,
        line: ba.d,
        head: arrowHead(ba, colorB),
        color: colorB,
        strokeWidth: 2,
      },
    ];
  });

  return { nodes, labelSize, edges };
}

export function buildGraphSvgMarkup(characters, relationships, width, height) {
  const { nodes, labelSize, edges } = buildGraphScene(
    characters,
    relationships,
    width,
    height
  );

  const lines = edges
    .map(
      (e) =>
        `<path d="${e.line}" stroke="${e.color}" stroke-width="${e.strokeWidth}" fill="none" stroke-linecap="round"/>`
    )
    .join('');

  const nodeCircles = nodes
    .map(
      (n) =>
        `<circle cx="${n.cx}" cy="${n.cy}" r="${n.r}" fill="${colors.surfaceCard}" stroke="${colors.borderLight}" stroke-width="1.5"/>`
    )
    .join('');

  const labels = nodes
    .map((n) => {
      const text = (n.name || '?').slice(0, Math.max(4, Math.floor(n.r / 3)));
      return `<text x="${n.cx}" y="${n.cy + labelSize * 0.35}" fill="${colors.text}" font-size="${labelSize}" font-weight="600" text-anchor="middle" font-family="Georgia, serif">${escapeXml(text)}</text>`;
    })
    .join('');

  const heads = edges
    .map((e) => `<path d="${e.head.d}" fill="${e.head.color}"/>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${colors.surfaceInset}"/>${lines}${nodeCircles}${labels}${heads}</svg>`;
}

export function previewGraphHeight(charCount, base = 200) {
  return Math.min(340, Math.max(base, base + charCount * 10));
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildLegendHtml() {
  return RELATIONSHIP_TYPES.map(
    (t) =>
      `<span class="legend-item"><span class="dot" style="background:${t.color}"></span>${t.label}</span>`
  ).join('');
}
