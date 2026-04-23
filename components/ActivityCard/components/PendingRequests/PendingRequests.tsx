import { Text, View } from 'react-native';
import { styles } from './PendingRequests.style';
import {
  PARTICIPANT_STATUS_ENUM,
  IPendingActivityParticipant,
} from '@/components/ActivityCard/types';
import { PendingRequestsItem } from '@/components/ActivityCard/components/PendingRequests/PendingRequestsItem';

interface IPendingRequestsProps {
  pendingRequests: IPendingActivityParticipant[] | null;
  handleOpenProfile: (profileId: string) => void;
  handleMangeRequestStatus: (
    status: PARTICIPANT_STATUS_ENUM,
    id: string,
    activityId?: string
  ) => void;
}

export const PendingRequests = ({
  pendingRequests,
  handleOpenProfile,
  handleMangeRequestStatus,
}: IPendingRequestsProps) => {
  return (
    <View style={styles.requestsSection}>
      <Text style={styles.requestsHeader}>Pending Requests:</Text>
      {pendingRequests && pendingRequests.length > 0 ? (
        <View>
          {pendingRequests.map((item) => (
            <PendingRequestsItem
              key={item.id}
              pendingRequest={item}
              handleOpenProfile={handleOpenProfile}
              handleMangeRequestStatus={handleMangeRequestStatus}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.noRequestsText}>No pending requests for this activity.</Text>
      )}
    </View>
  );
};
