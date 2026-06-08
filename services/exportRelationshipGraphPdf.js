import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { relationshipLabel } from '../constants/relationships';
import { colors } from '../constants/theme';
import {
  buildGraphSvgMarkup,
  buildLegendHtml,
  previewGraphHeight,
} from '../utils/relationshipGraphGeometry';

const PDF_GRAPH_W = 520;
const PDF_GRAPH_H = 420;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildRelationshipRows(relationships, getCharacterById) {
  if (!relationships.length) {
    return '<p class="muted">No relationships defined yet.</p>';
  }

  return relationships
    .map((r) => {
      const a = getCharacterById(r.charAId)?.name || '?';
      const b = getCharacterById(r.charBId)?.name || '?';
      const aToB = relationshipLabel(r.dynamicAToB);
      const bToA = relationshipLabel(r.dynamicBToA);
      return `<tr>
        <td>${escapeHtml(a)} ↔ ${escapeHtml(b)}</td>
        <td>${escapeHtml(a)} → ${escapeHtml(b)}: ${escapeHtml(aToB)}</td>
        <td>${escapeHtml(b)} → ${escapeHtml(a)}: ${escapeHtml(bToA)}</td>
      </tr>`;
    })
    .join('');
}

export function buildRelationshipGraphPdfHtml({
  worldName,
  characters,
  relationships,
  getCharacterById,
}) {
  const graphH = Math.max(PDF_GRAPH_H, previewGraphHeight(characters.length, 320));
  const svg = buildGraphSvgMarkup(characters, relationships, PDF_GRAPH_W, graphH);
  const exportedAt = new Date().toLocaleString();
  const charList = characters.map((c) => escapeHtml(c.name)).join(', ') || 'None';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 28px;
      background: ${colors.background};
      color: ${colors.text};
      font-family: Georgia, 'Times New Roman', serif;
    }
    h1 {
      margin: 0 0 4px;
      font-size: 22px;
      letter-spacing: 0.5px;
    }
    .sub {
      color: ${colors.textMuted};
      font-size: 12px;
      margin-bottom: 18px;
    }
    .graph-wrap {
      background: ${colors.surfaceInset};
      border: 1px solid ${colors.borderLight};
      border-radius: 12px;
      padding: 8px;
      margin-bottom: 16px;
      text-align: center;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
      font-size: 11px;
      color: ${colors.textSecondary};
    }
    .legend-item { display: inline-flex; align-items: center; gap: 6px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    h2 {
      font-size: 14px;
      letter-spacing: 1px;
      color: ${colors.goldMuted};
      margin: 0 0 8px;
    }
    .chars { font-size: 13px; margin-bottom: 16px; color: ${colors.textSecondary}; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th, td {
      border: 1px solid ${colors.border};
      padding: 8px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: ${colors.surfaceCard};
      color: ${colors.textSecondary};
      font-weight: 600;
    }
    .muted { color: ${colors.textMuted}; font-size: 13px; }
  </style>
</head>
<body>
  <h1>Relationship Graph</h1>
  <p class="sub">${escapeHtml(worldName)} · Exported ${escapeHtml(exportedAt)}</p>
  <div class="graph-wrap">${svg}</div>
  <div class="legend">${buildLegendHtml()}</div>
  <h2>CHARACTERS</h2>
  <p class="chars">${charList}</p>
  <h2>RELATIONSHIPS</h2>
  <table>
    <thead>
      <tr>
        <th>Pair</th>
        <th>A → B</th>
        <th>B → A</th>
      </tr>
    </thead>
    <tbody>
      ${buildRelationshipRows(relationships, getCharacterById)}
    </tbody>
  </table>
</body>
</html>`;
}

export async function exportRelationshipGraphPdf({
  worldName,
  characters,
  relationships,
  getCharacterById,
}) {
  if (characters.length < 2) {
    throw new Error('Add at least two characters to export the graph.');
  }

  const html = buildRelationshipGraphPdfHtml({
    worldName,
    characters,
    relationships,
    getCharacterById,
  });

  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: 'Export relationship graph',
    });
  }

  return uri;
}
