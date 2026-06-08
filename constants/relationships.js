export const RELATIONSHIP_TYPES = [
  { key: 'friends', label: 'Friends', color: '#4ADE80' },
  { key: 'enemies', label: 'Enemies', color: '#EF4444' },
  { key: 'romantic', label: 'Romantic feelings', color: '#F9A8D4' },
  { key: 'other', label: 'Other', color: '#60A5FA' },
];

const KNOWN_KEYS = new Set(RELATIONSHIP_TYPES.map((t) => t.key));

export function parseRelationshipValue(value) {
  if (!value) return { type: 'other', custom: '' };
  if (KNOWN_KEYS.has(value)) return { type: value, custom: '' };
  if (value.startsWith('other:')) {
    return { type: 'other', custom: value.slice(6) };
  }
  return { type: 'other', custom: value };
}

export function serializeRelationshipValue(type, custom = '') {
  if (type !== 'other') return type;
  const trimmed = custom.trim();
  return trimmed ? `other:${trimmed}` : 'other';
}

export function relationshipColor(value) {
  const { type } = parseRelationshipValue(value);
  const match = RELATIONSHIP_TYPES.find((t) => t.key === type);
  return match?.color ?? '#60A5FA';
}

export function relationshipLabel(value) {
  const { type, custom } = parseRelationshipValue(value);
  if (type === 'other' && custom) return custom;
  const match = RELATIONSHIP_TYPES.find((t) => t.key === type);
  return match?.label ?? 'Other';
}
