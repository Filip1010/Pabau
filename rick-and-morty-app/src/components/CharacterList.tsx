import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useInView } from 'react-intersection-observer';
import { GET_CHARACTERS } from '../queries/characters';
import { CharactersData, CharactersVars } from '../types';
import { 
  Person as PersonIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  Transgender as TransgenderIcon,
  Public as GlobeIcon,
  Favorite as HeartIcon,
  Help as UnknownIcon,
  FilterAlt as FilterIcon,
  Sort as SortIcon,
  Translate as LanguageIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { alpha, styled } from '@mui/system';
import { useTranslation } from 'react-i18next';

const GradientBackground = styled('div')({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  minHeight: '100vh',
  padding: '2rem',
  color: '#ffffff' // Ensure text is visible
});

const Card = styled(motion.div)(({ theme }) => ({
  background: alpha('#fff', 0.08),
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid',
  borderColor: alpha('#9c27b0', 0.3),
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  color: '#ffffff', // Explicit text color
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(156, 39, 176, 0.3)',
    borderColor: alpha('#9c27b0', 0.6)
  }
}));

const statusColors = {
  Alive: '#4caf50',
  Dead: '#f44336',
  unknown: '#9e9e9e'
};

const GenderIcon = ({ gender }: { gender: string }) => {
  switch (gender.toLowerCase()) {
    case 'female': return <FemaleIcon fontSize="small" />;
    case 'male': return <MaleIcon fontSize="small" />;
    case 'genderless': return <TransgenderIcon fontSize="small" />;
    default: return <UnknownIcon fontSize="small" />;
  }
};

export default function CharacterList() {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({ status: '', species: '' });
  const [sortBy, setSortBy] = useState<'name' | 'origin'>('name');
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();

  const { loading, error, data, fetchMore } = useQuery<CharactersData, CharactersVars>(
    GET_CHARACTERS,
    { variables: { page: 1, filter: filters } }
  );

  useEffect(() => {
    if (inView && data?.characters.info?.next) {
      fetchMore({ 
        variables: { page: page + 1 },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            characters: {
              ...fetchMoreResult.characters,
              results: [...prev.characters.results, ...fetchMoreResult.characters.results],
            },
          };
        },
      });
      setPage(prev => prev + 1);
    }
  }, [inView, data?.characters.info?.next, fetchMore, page]);

  const sortedCharacters = [...(data?.characters.results || [])].sort((a, b) => 
    sortBy === 'name' 
      ? a.name.localeCompare(b.name) 
      : a.origin.name.localeCompare(b.origin.name)
  );

  if (loading && !data) return (
    <GradientBackground className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <HeartIcon sx={{ fontSize: 60, color: '#9c27b0' }} />
      </motion.div>
    </GradientBackground>
  );

  if (error) return (
    <GradientBackground className="flex items-center justify-center">
      <div className="text-white text-center p-6 bg-red-500/20 rounded-xl">
        {t('error')}: {error.message}
      </div>
    </GradientBackground>
  );

  return (
    <GradientBackground>
      <div className="max-w-7xl mx-auto">
        {/* Header with language selector */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              {t('title')}
            </h1>
            <p className="text-purple-200 mt-2">{t('subtitle')}</p>
          </motion.div>
          
          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
            <LanguageIcon className="text-purple-200" />
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-transparent text-purple-100 border-none focus:ring-0"
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>

        {/* Filter/Sort Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-purple-500/30 mb-8 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <FilterIcon className="text-purple-200" />
            <h2 className="text-xl font-semibold text-purple-100">
              {t('filters.title')}
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label htmlFor="status-filter" className="block text-sm font-medium text-purple-200 mb-1 flex items-center gap-1">
                <FilterIcon fontSize="small" /> {t('filters.status')}
              </label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full rounded-lg bg-gray-900/50 border border-purple-500/30 text-purple-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">{t('filters.allStatuses')}</option>
                <option value="alive">{t('status.alive')}</option>
                <option value="dead">{t('status.dead')}</option>
                <option value="unknown">{t('status.unknown')}</option>
              </select>
            </div>

            {/* Species Filter */}
            <div className="flex-1">
              <label htmlFor="species-filter" className="block text-sm font-medium text-purple-200 mb-1 flex items-center gap-1">
                <FilterIcon fontSize="small" /> {t('filters.species')}
              </label>
              <input
                id="species-filter"
                type="text"
                placeholder={t('filters.speciesPlaceholder')}
                value={filters.species}
                onChange={(e) => setFilters({...filters, species: e.target.value})}
                className="w-full rounded-lg bg-gray-900/50 border border-purple-500/30 text-purple-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sorting Controls */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-purple-200 mb-2 flex items-center gap-1">
              <SortIcon fontSize="small" /> {t('sorting.title')}
            </label>
            <div className="flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy('name')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  sortBy === 'name' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-gray-900/50 text-purple-100 hover:bg-gray-800/70'
                }`}
              >
                <SortIcon fontSize="small" />
                {t('sorting.name')} {sortBy === 'name' && '↓'}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy('origin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  sortBy === 'origin' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-gray-900/50 text-purple-100 hover:bg-gray-800/70'
                }`}
              >
                <SortIcon fontSize="small" />
                {t('sorting.origin')} {sortBy === 'origin' && '↓'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {sortedCharacters.map((character) => (
              <Card
                key={character.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {/* Status Indicator */}
                <div 
                  className="h-1.5" 
                  style={{ backgroundColor: statusColors[character.status as keyof typeof statusColors] || '#9e9e9e' }}
                ></div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <motion.h3 
                      whileHover={{ color: '#d946ef' }}
                      className="text-lg font-bold text-purple-100 mb-1"
                    >
                      {character.name}
                    </motion.h3>
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: alpha(statusColors[character.status as keyof typeof statusColors] || '#9e9e9e', 0.2),
                        color: statusColors[character.status as keyof typeof statusColors] || '#9e9e9e'
                      }}
                    >
                      {t(`status.${character.status.toLowerCase()}`)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-purple-200">
                      <PersonIcon fontSize="small" className="mr-2" />
                      <span className="font-medium">{t('character.species')}:</span>
                      <span className="ml-1">{character.species}</span>
                    </div>
                    <div className="flex items-center text-sm text-purple-200">
                      <GenderIcon gender={character.gender} className="mr-2" />
                      <span className="font-medium">{t('character.gender')}:</span>
                      <span className="ml-1">{t(`gender.${character.gender.toLowerCase()}`)}</span>
                    </div>
                    <div className="flex items-center text-sm text-purple-200">
                      <GlobeIcon fontSize="small" className="mr-2" />
                      <span className="font-medium">{t('character.origin')}:</span>
                      <span className="ml-1">{character.origin.name}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </AnimatePresence>
        </div>

        {/* Infinite Scroll Loader */}
        <div ref={ref} className="mt-8">
          {loading && (
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 rounded-full border-t-2 border-b-2 border-purple-500"
              ></motion.div>
            </div>
          )}
        </div>
      </div>
    </GradientBackground>
  );
}