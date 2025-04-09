import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { useInView } from 'react-intersection-observer';
import { GET_CHARACTERS } from '../queries/characters';
import { CharactersData, CharactersVars } from '../types';
import Header from './Header';
import {
  Person as PersonIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  Transgender as TransgenderIcon,
  Public as GlobeIcon,
  Help as UnknownIcon,
} from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { alpha, styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; // Import your i18n configuration

const GradientBackground = styled('div')({
  background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(97,29,158,1) 100%)',
  minHeight: '100vh',
  padding: '2rem',
  color: '#ffffff',
  position: 'relative',
});

const CardsGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '2.7rem',
  padding: '1.5rem',
  width: '100%',         
});

const Card = styled(motion.div)({
  background: alpha('#fff', 0.06),
  backdropFilter: 'blur(8px)',
  borderRadius: '16px',
  border: '1px solid',
  borderColor: alpha('#9c27b0', 0.3),
  color: '#ffffff',
  padding: '1rem',
  width: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 20px rgba(156, 39, 176, 0.3)',
    borderColor: alpha('#9c27b0', 0.6),
  },
});

const StyledButton = styled(Button)(({ variant }) => ({
  backgroundColor: variant === 'contained' ? '#9c27b0' : 'transparent',
  color: '#ffffff',
  borderColor: '#ce93d8',
  '&:hover': {
    backgroundColor: variant === 'contained' ? '#7b1fa2' : '#ce93d8',
    borderColor: '#ce93d8',
  }
}));

const statusColors = {
  Alive: '#4caf50',
  Dead: '#f44336',
  unknown: '#9e9e9e',
};

const GenderIcon = memo(({ gender }: { gender: string }) => {
  switch (gender.toLowerCase()) {
    case 'female': return <FemaleIcon fontSize="small" />;
    case 'male': return <MaleIcon fontSize="small" />;
    case 'genderless': return <TransgenderIcon fontSize="small" />;
    default: return <UnknownIcon fontSize="small" />;
  }
});

const StatusBadge = styled('div')(({ status }: { status: keyof typeof statusColors }) => ({
  position: 'absolute',
  top: '10px',
  left: '10px',
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: statusColors[status],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
}));

import { Character } from '../types'; 
import LanguageSwitcher from './LanguageSwitcher';

const CardContent = memo(({ character }: { character: Character }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{ position: 'relative' }}>
      <StatusBadge status={character.status as keyof typeof statusColors}>
        {t(`status.${character.status.toLowerCase()}`)}
      </StatusBadge>
      <div style={{ 
        paddingLeft: '90px', // Increased from 80px to accommodate larger badge
        paddingTop: '10px',
        minHeight: '80px' // Ensure consistent height for card content
      }}>
        <h3 className="text-lg font-bold mb-1">{character.name}</h3>
        <div className="space-y-1 text-sm">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon fontSize="small" className="mr-1" />
            <span> -  {t('character.species')}: {character.species}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GenderIcon gender={character.gender} />
            <span> -  {t('character.gender')}: {t(`gender.${character.gender.toLowerCase()}`)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GlobeIcon fontSize="small" className="mr-1" />
            <span> -  {t('character.origin')}: {character.origin.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const CardComponent = memo(({ character }: { character: Character }) => (
  <Card
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
  >
    <CardContent character={character} />
  </Card>
));

export default function CharacterList() {
  const { t, ready } = useTranslation();
  const [filters, setFilters] = useState({ status: '', species: '' });
  const [sortBy, setSortBy] = useState<'name' | 'origin'>('name');
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();

  // Set default language to English on initial load
  useEffect(() => {
    if (!localStorage.getItem('i18nextLng')) {
      i18n.changeLanguage('en');
    }
  }, []);

  const { loading, error, data, fetchMore } = useQuery<CharactersData, CharactersVars>(
    GET_CHARACTERS,
    { 
      variables: { page: 1, filter: filters },
      notifyOnNetworkStatusChange: true,
    }
  );

  const handleFetchMore = useCallback(() => {
    if (data?.characters.info?.next && !loading) {
      fetchMore({
        variables: { page: page + 1 },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            characters: {
              ...fetchMoreResult.characters,
              info: fetchMoreResult.characters.info,
              results: [
                ...prev.characters.results,
                ...fetchMoreResult.characters.results,
              ],
            },
          };
        },
      });
      setPage((prev) => prev + 1);
    }
  }, [data, loading, fetchMore, page]);

  useEffect(() => {
    if (inView) handleFetchMore();
  }, [inView, handleFetchMore]);

  const sortedCharacters = useMemo(() => {
    return [...(data?.characters.results || [])].sort((a, b) =>
      sortBy === 'name'
        ? a.name.localeCompare(b.name)
        : a.origin.name.localeCompare(b.origin.name)
    );
  }, [data?.characters.results, sortBy]);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setPage(1);
  }, []);

  const handleSortChange = useCallback((type: 'name' | 'origin') => {
    setSortBy(type);
  }, []);

  // Show loading state while translations are loading
  if (!ready) {
    return (
      <GradientBackground className="flex items-center justify-center">
        <div className="text-purple-200 animate-pulse">{t('loading')}</div>
      </GradientBackground>
    );
  }

  if (loading && !data) {
    return (
      <GradientBackground className="flex items-center justify-center">
        <div className="text-purple-200 animate-pulse">{t('loading')}</div>
      </GradientBackground>
    );
  }

  if (error) {
    return (
      <GradientBackground className="flex items-center justify-center">
        <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">
          {t('error')}: {error.message}
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <div className="max-w-7xl mx-auto">
        <div style={{ position: 'absolute', top: '2rem', right: '3.9rem' }}>
          <LanguageSwitcher />
        </div>
        <div style={{ marginBottom: '4rem' }}></div>
        <Header/>

        {/* Filters and Sorting */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            gap: '1.0rem',
            flexWrap: 'wrap',
            marginBottom: '0.3rem',
            padding: '1.8rem',
            color: '#fff',
          }}
        >
          <FormControl variant="filled" size="small" sx={{ minWidth: 100, backgroundColor: alpha('#fff', 0.1) }}>
            <InputLabel sx={{ color: '#fff' }}>{t('filters.status')}</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              <MenuItem value="Alive">{t('status.alive')}</MenuItem>
              <MenuItem value="Dead">{t('status.dead')}</MenuItem>
              <MenuItem value="unknown">{t('status.unknown')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="filled" size="small" sx={{ minWidth: 120, backgroundColor: alpha('#fff', 0.1) }}>
            <InputLabel sx={{ color: '#fff' }}>{t('filters.species')}</InputLabel>
            <Select
              value={filters.species}
              onChange={(e) => handleFilterChange('species', e.target.value)}
              sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              <MenuItem value="Human">{t('filters.human')}</MenuItem>
              <MenuItem value="Alien">{t('filters.alien')}</MenuItem>
              <MenuItem value="Robot">{t('filters.robot')}</MenuItem>
            </Select>
          </FormControl>

          <ButtonGroup>
            <StyledButton
              onClick={() => handleSortChange('name')}
              variant={sortBy === 'name' ? 'contained' : 'outlined'}
            >
              {t('sortByName')}
            </StyledButton>
            <StyledButton
              onClick={() => handleSortChange('origin')}
              variant={sortBy === 'origin' ? 'contained' : 'outlined'}
            >
              {t('sortByOrigin')}
            </StyledButton>
          </ButtonGroup>
        </Box>

        {/* Character Cards */}
        <CardsGrid>
          <AnimatePresence>
            {sortedCharacters.map((character) => (
              <CardComponent key={character.id} character={character} />
            ))}
          </AnimatePresence>
        </CardsGrid>

        {/* Loading Trigger */}
        <div ref={ref} className="mt-8">
          {loading && (
            <div className="flex justify-center animate-pulse">
              <div className="text-purple-300">{t('loading')}</div>
            </div>
          )}
        </div>
      </div>
    </GradientBackground>
  );
}