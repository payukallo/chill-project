import {
  UserUpdateContainer,
  type IUserUpdateContainer,
} from "./UserUpdateContainer";

import type { IUserSubscription } from "../services/subscriptionService";
import { SubscriptionContainerProfile } from "./SubscriptionProfile";

interface IProfileContainer extends IUserUpdateContainer {
  subscription: IUserSubscription | null;
  subscriptionLoading: boolean;
  subscriptionError: boolean;
}

export function ProfileContainer({
  subscription,
  subscriptionLoading,
  subscriptionError,
  ...userUpdateProps
}: IProfileContainer) {
  return (
    <div className="profile-container">
      <SubscriptionContainerProfile
        subscription={subscription}
        subscriptionLoading={subscriptionLoading}
        subscriptionError={subscriptionError}
      />

      <UserUpdateContainer {...userUpdateProps} />
    </div>
  );
}
