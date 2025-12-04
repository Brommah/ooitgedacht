/**
 * WeatherAlertWidget - Weather warnings (builder only)
 */
import React, { useState } from 'react';
import { CloudRain, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WidgetComponentProps } from '../types';

export const WeatherAlertWidget: React.FC<WidgetComponentProps> = ({
  viewMode,
  isEditing,
}) => {
  const [showAlert, setShowAlert] = useState(true);
  
  // Only show for builder view
  if (viewMode === 'customer') return null;
  
  if (!showAlert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
      >
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
          <CloudRain size={20} className="text-amber-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-300 font-medium">Vrijdag: Zware regen - niet storten!</p>
          </div>
          <button className="px-3 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-lg flex-shrink-0">
            Aanpassen
          </button>
          {!isEditing && (
            <button onClick={() => setShowAlert(false)} className="text-amber-400/50 hover:text-amber-400">
              <X size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherAlertWidget;




