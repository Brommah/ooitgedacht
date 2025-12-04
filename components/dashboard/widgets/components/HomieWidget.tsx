/**
 * HomieWidget - AI recommendations widget
 */
import React from 'react';
import { WidgetComponentProps } from '../types';
import { HomieRecommendations } from '../../HomieRecommendations';

export const HomieWidget: React.FC<WidgetComponentProps> = ({
  viewMode,
}) => {
  return <HomieRecommendations viewMode={viewMode} />;
};

export default HomieWidget;

