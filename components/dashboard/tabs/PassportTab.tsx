/**
 * PassportTab - Full Woningpaspoort view
 * 
 * Dedicated tab for the digital building passport showing:
 * - Animated house visualization
 * - All building specifications
 * - Verification status per section
 * - Energy performance details
 */
import React from 'react';
import { motion } from 'framer-motion';
import { WoningpaspoortPreview } from '../WoningpaspoortPreview';
import { containerVariants, itemVariants } from '../BentoGrid';

interface PassportTabProps {
  projectName: string;
  address: string;
  energyLabel: string;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  buildPhase: number;
}

export const PassportTab: React.FC<PassportTabProps> = ({
  projectName,
  address,
  energyLabel,
  sqm,
  bedrooms,
  bathrooms,
  buildPhase,
}) => {
  return (
    <div className="px-4 py-4 lg:px-8 lg:py-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Woningpaspoort
          </h1>
          <p className="text-white/50">
            Digitaal dossier van alle bouwspecificaties en verificaties
          </p>
        </motion.div>

        {/* Main Passport Card */}
        <motion.div variants={itemVariants}>
          <WoningpaspoortPreview
            projectName={projectName}
            address={address}
            energyLabel={energyLabel}
            sqm={sqm}
            bedrooms={bedrooms}
            bathrooms={bathrooms}
            buildPhase={buildPhase}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PassportTab;




