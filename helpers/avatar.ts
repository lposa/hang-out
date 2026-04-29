import { supabase } from '@/services/Supabase';
import { AVATARS_BUCKET } from '@/constants';

export const extractAvatarObjectPath = (avatarValue: string): string | null => {
  const withoutQuery = avatarValue.split('?')[0];
  const match = withoutQuery.match(/\/storage\/v1\/object\/(?:public|sign)\/avatars\/(.+)$/);
  return match?.[1] ?? null;
};

export const resolveSignedAvatarUri = async (
  avatarValue: string | null
): Promise<string | undefined> => {
  if (!avatarValue) return undefined;

  const objectPath = avatarValue.startsWith('http')
    ? (extractAvatarObjectPath(avatarValue) ?? null)
    : avatarValue;

  if (!objectPath) return undefined;

  const { data, error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .createSignedUrl(objectPath, 60 * 60 * 24 * 7);

  if (error) return undefined;
  return data.signedUrl;
};
