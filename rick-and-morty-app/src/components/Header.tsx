import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="relative w-full min-h-[70vh] flex items-center justify-center mb-8">
      {/* Centered Content */}
      <div className="w-full flex flex-col items-center justify-center"> {/* Adjusted wrapper div */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, x: 30 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-400 mb-4">
            {t('title')}
          </h1>
          <p className="text-purple-200 text-lg md:text-xl">
            {t('subtitle')}
          </p>
        </motion.div>
      </div>
    </header>
  );
}
