/**
 * ActionsWidget - Customer actions or Builder tasks
 */
import React from 'react';
import { WidgetComponentProps } from '../types';
import { CustomerActionsCard } from '../../CustomerActionsCard';
import { WhatsNextCard } from '../../WhatsNextCard';

export const ActionsWidget: React.FC<WidgetComponentProps> = ({
  viewMode,
  isEditing,
}) => {
  const isCustomer = viewMode === 'customer';

  return isCustomer ? <CustomerActionsCard /> : <WhatsNextCard />;
};

export default ActionsWidget;




