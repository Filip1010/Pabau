import { useState, useEffect, useMemo, memo, useCallback } from 'react';
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
  Help as UnknownIcon,
  Translate as LanguageIcon,
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
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: statusColors[status],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
}));

import { Character } from '../types'; // Ensure this type is defined in your types file

const CardContent = memo(({ character }: { character: Character }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{ position: 'relative' }}>
      <StatusBadge status={character.status as keyof typeof statusColors}>
        {t(`status.${character.status.toLowerCase()}`)}
      </StatusBadge>
      <div style={{ paddingLeft: '80px', paddingTop: '10px' }}>
        <h3 className="text-lg font-bold mb-1">{character.name}</h3>
        <div className="space-y-1 text-sm">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon fontSize="small" className="mr-1" />
            <span>- {t('character.species')}: {character.species}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GenderIcon gender={character.gender} />
            <span>- {t('character.gender')}: {t(`gender.${character.gender.toLowerCase()}`)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GlobeIcon fontSize="small" className="mr-1" />
            <span>- {t('character.origin')}: {character.origin.name}</span>
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
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({ status: '', species: '' });
  const [sortBy, setSortBy] = useState<'name' | 'origin'>('name');
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();

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
        {/* Header and Language Selector */}
        <div className="relative mb-8 flex items-center justify-center flex-col">
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/10 p-2 rounded-lg">
            <LanguageIcon className="text-purple-200" />
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-transparent text-purple-100 border-none focus:ring-0"
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center flex flex-col items-center"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-400">
              {t('title')}
            </h1>
            <p className="text-purple-200 mt-2">{t('subtitle')}</p>
          </motion.div>
        </div>

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
            <InputLabel sx={{ color: '#fff' }}>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Alive">Alive</MenuItem>
              <MenuItem value="Dead">Dead</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="filled" size="small" sx={{ minWidth: 120, backgroundColor: alpha('#fff', 0.1) }}>
            <InputLabel sx={{ color: '#fff' }}>Species</InputLabel>
            <Select
              value={filters.species}
              onChange={(e) => handleFilterChange('species', e.target.value)}
              sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Human">Human</MenuItem>
              <MenuItem value="Alien">Alien</MenuItem>
              <MenuItem value="Robot">Robot</MenuItem>
            </Select>
          </FormControl>

          <ButtonGroup>
            <StyledButton
              onClick={() => handleSortChange('name')}
              variant={sortBy === 'name' ? 'contained' : 'outlined'}
            >
              Sort by Name
            </StyledButton>
            <StyledButton
              onClick={() => handleSortChange('origin')}
              variant={sortBy === 'origin' ? 'contained' : 'outlined'}
            >
              Sort by Origin
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