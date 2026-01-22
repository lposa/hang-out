import { ACTIVITY_TYPES_ENUM } from '@/constants/activity-types';
import { Tag } from '@/components/elements/Tag/Tag';

export const ActivityTag = ({ activityType }: { activityType: ACTIVITY_TYPES_ENUM }) => {
  let text = '';
  let backgroundColor = '';

  if (activityType === ACTIVITY_TYPES_ENUM.MOVIE) {
    text = 'movies';
    backgroundColor = '#FF5F6D';
  } else if (activityType === ACTIVITY_TYPES_ENUM.BASKETBALL) {
    text = 'basketball';
    backgroundColor = '#D92550';
  } else {
    text = 'activity';
    backgroundColor = '#FFC371';
  }

  return <Tag text={text} backgroundColor={backgroundColor} />;
};
