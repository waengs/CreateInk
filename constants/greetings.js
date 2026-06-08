export const GREETINGS = [
  'What story will you forge today?',
  'Every world begins with a spark.',
  'Stories breathe here.',
  'Shape legends from fragments.',
  'A thousand untold stories await.',
  'Where imagination becomes canon.',
  'Build worlds worth getting lost in.',
  'Your universe is still expanding.',
  'Your favorite characters deserve drama.',
  'One more emotionally devastating storyline?',
  'Write the scene you wish existed.',
  'Canon is optional.',
  'Fix-it fics start here.',
  'Welcome back, storyteller.',
  'Ready to continue your world?',
  'Your characters missed you.',
  'Pick up where the chaos left off.',
  'A quiet place for loud imaginations.',
  'Write something unforgettable today.',
];

let lastIndex = -1;

export function pickGreeting() {
  if (GREETINGS.length === 0) return '';
  if (GREETINGS.length === 1) return GREETINGS[0];

  let index;
  do {
    index = Math.floor(Math.random() * GREETINGS.length);
  } while (index === lastIndex);

  lastIndex = index;
  return GREETINGS[index];
}
