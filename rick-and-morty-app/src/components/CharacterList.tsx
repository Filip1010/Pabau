import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { useInView } from 'react-intersection-observer';
import { GET_CHARACTERS } from '../queries/characters';
import { Character, CharactersData, CharactersVars } from '../types';
import Header from './Header';
import Footer from './Footer';
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
import i18n from '../i18n';

const GradientBackground = styled('div')({
  background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(97,29,158,1) 100%)',
  minHeight: '100vh',
  padding: '1rem',
  color: '#ffffff',
  position: 'relative',
});

const CardsGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.5rem',
  padding: '1rem',
  width: '100%',
  '@media (max-width: 600px)': {
    gridTemplateColumns: '1fr',
    gap: '1rem',
    padding: '0.5rem'
  }
});

const Card = styled(motion.div)({
  background: alpha('#fff', 0.06),
  backdropFilter: 'blur(8px)',
  borderRadius: '16px',
  border: '1px solid',
  borderColor: alpha('#9c27b0', 0.3),
  color: '#ffffff',
  padding: '0.9rem',
  width: '86%',
  maxWidth: '100%', 
  boxSizing: 'border-box',
  transition: 'all 0.3s ease',
  fontFamily: '"Roboto Mono", monospace',
  margin: '1rem 0', 
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 20px rgba(156, 39, 176, 0.3)',
    borderColor: alpha('#9c27b0', 0.6),
  },
  '@media (max-width: 768px)': {
    padding: '0.8rem',
  },
  '@media (max-width: 480px)': {
    padding: '0.7rem',
    margin: '1rem 0.5rem', // Avoids touching screen edges
  },
});


const StyledButton = styled(Button)(({ variant }) => ({
  backgroundColor: variant === 'contained' ? '#9c27b0' : 'transparent',
  color: '#ffffff',
  borderColor: '#ce93d8',
  fontFamily: '"Roboto Mono", monospace',
  '&:hover': {
    backgroundColor: variant === 'contained' ? '#7b1fa2' : '#ce93d8',
    borderColor: '#ce93d8',
  },
  '@media (max-width: 480px)': {
    fontSize: '0.8rem',
    padding: '6px 12px',
    width: '100%'
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
  top: '5px',
  left: '5px',
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: statusColors[status],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '10px',
  fontWeight: 'bold',
  fontFamily: '"Roboto Mono", monospace',
  '@media (max-width: 480px)': {
    width: '45px',
    height: '45px',
    fontSize: '8px',
    top: '8px',
    left: '8px'
  }
}));

const CardContent = memo(({ character }: { character: Character }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{ position: 'relative' }}>
      <StatusBadge status={character.status as keyof typeof statusColors}>
        {t(`status.${character.status.toLowerCase()}`)}
      </StatusBadge>
      <div style={{ 
        paddingLeft: '80px',
        paddingTop: '8px',
        minHeight: '70px',
        // '@media (max-width: 480px)': {
        //   paddingLeft: '60px',
        //   minHeight: '60px'
        // }
      }}>
        <h3 style={{ 
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '0.8rem',
          fontFamily: '"Roboto Mono", monospace',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          // '@media (max-width: 480px)': {
          //   fontSize: '1rem',
          //   marginBottom: '0.6rem'
          // }
        }}>
          {character.name}
        </h3>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          alignItems: 'center',
          gap: '0.5rem 0.3rem',
          fontSize: '0.9rem',
          // '@media (max-width: 480px)': {
          //   fontSize: '0.8rem',
          //   gap: '0.4rem 0.2rem'
          // }
        }}>
          <PersonIcon fontSize="small" style={{ minWidth: '24px' }} />
          <span>{t('character.species')}: {character.species}</span>
          
          <GenderIcon gender={character.gender} />
          <span>{t('character.gender')}: {t(`gender.${character.gender.toLowerCase()}`)}</span>
          
          <GlobeIcon fontSize="small" style={{ minWidth: '24px' }} />
          <span>{t('character.origin')}: {character.origin.name}</span>
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

  if (!ready || (loading && !data)) {
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap');
      `}</style>
      
      <GradientBackground>
        <div className="max-w-7xl mx-auto" style={{ paddingBottom: '60px' }}>
          <Header/>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1.0rem',
              flexWrap: 'wrap',
              marginBottom: '0.4rem',
              padding: '1rem',
              color: '#fff',
              '@media (max-width: 480px)': {
                flexDirection: 'column',
                gap: '0.8rem',
                padding: '0.8rem 0.5rem'
              }
            }}
          >
            <FormControl variant="filled" size="small" sx={{ 
              minWidth: 100, 
              backgroundColor: alpha('#fff', 0.1),
              '@media (max-width: 480px)': {
                width: '100%'
              }
            }}>
              <InputLabel sx={{ color: '#fff', fontFamily: '"Roboto Mono", monospace' }}>
                {t('filters.status')}
              </InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                sx={{ 
                  color: '#fff', 
                  '& .MuiSvgIcon-root': { color: '#fff' },
                  fontFamily: '"Roboto Mono", monospace'
                }}
              >
                {['', 'Alive', 'Dead', 'unknown'].map((status) => (
                  <MenuItem 
                    key={status || 'all'} 
                    value={status}
                    sx={{ fontFamily: '"Roboto Mono", monospace' }}
                  >
                    {status ? t(`status.${status.toLowerCase()}`) : t('all')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="filled" size="small" sx={{ 
              minWidth: 120, 
              backgroundColor: alpha('#fff', 0.1),
              '@media (max-width: 480px)': {
                width: '100%'
              }
            }}>
              <InputLabel sx={{ color: '#fff', fontFamily: '"Roboto Mono", monospace' }}>
                {t('filters.species')}
              </InputLabel>
              <Select
                value={filters.species}
                onChange={(e) => handleFilterChange('species', e.target.value)}
                sx={{ 
                  color: '#fff', 
                  '& .MuiSvgIcon-root': { color: '#fff' },
                  fontFamily: '"Roboto Mono", monospace'
                }}
              >
                {['', 'Human', 'Alien', 'Robot'].map((species) => (
                  <MenuItem 
                    key={species || 'all'} 
                    value={species}
                    sx={{ fontFamily: '"Roboto Mono", monospace' }}
                  >
                    {species ? t(`filters.${species.toLowerCase()}`) : t('all')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ButtonGroup sx={{
              '@media (max-width: 480px)': {
                width: '100%',
                flexDirection: 'column',
                gap: '0.5rem'
              }
            }}>
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

          <CardsGrid>
            <AnimatePresence>
              {sortedCharacters.map((character) => (
                <CardComponent key={character.id} character={character} />
              ))}
            </AnimatePresence>
          </CardsGrid>

          <div ref={ref} style={{ height: '20px', marginTop: '20px' }}>
            {loading && (
              <div className="flex justify-center animate-pulse">
                <div className="text-purple-300" style={{ fontFamily: '"Roboto Mono", monospace' }}>
                  {t('loading')}
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </GradientBackground>
    </>
  );
}