import { randomUUID } from 'crypto';

const generateAvatar = (firstName: string, email: string) => {
  const seed = `${firstName}-${randomUUID()}`;
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
};

export default generateAvatar;
