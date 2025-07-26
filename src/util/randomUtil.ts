export function getRandomUsername(): string {
  return `user_${Math.floor(Math.random() * 100000)}`;
}
