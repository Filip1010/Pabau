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
  Help as UnknownIcon,
  Translate as LanguageIcon
} from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { alpha, styled } from '@mui/system';
import { useTranslation } from 'react-i18next';

// Gradient background for the entire page
const GradientBackground = styled('div')({
  background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(97,29,158,1) 100%, rgba(0,212,255,1) 100%)',
  minHeight: '100vh',
  padding: '2rem',
  color: '#ffffff'
});

// Grid container for cards with spacing
const CardsGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '2.7rem',
  padding: '1.5rem',
});

// Styled card component
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

// Styled Button for Sort Buttons
const StyledButton = styled(Button)(({ variant }) => ({
  backgroundColor: variant === 'contained' ? '#9c27b0' : 'transparent', // Vibrant purple for active
  color: '#ffffff',
  borderColor: '#ce93d8', // Light purple border for inactive
  '&:hover': {
    backgroundColor: variant === 'contained' ? '#7b1fa2' : '#ce93d8', // Darker purple on hover for active, light purple for inactive
    borderColor: '#ce93d8',
  },
  transition: 'all 0.3s ease',
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
      <div className="text-purple-200 animate-pulse">Loading...</div>
    </GradientBackground>
  );

  if (error) return (
    <GradientBackground className="flex items-center justify-center">
      <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">
        {t('error')}: {error.message}
      </div>
    </GradientBackground>
  );

  return (
    <GradientBackground>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-8 flex flex-col items-center">
          <div className="absolute right-0 top-0 flex items-center gap-2 bg-white/10 p-2 rounded-lg">
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
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-400">
              {t('title')}
            </h1>
            <p className="text-purple-200 mt-2">{t('subtitle')}</p>
          </motion.div>
        </div>

        {/* Filter + Sort */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            gap: '1.0rem',
            flexWrap: 'wrap', // Allow wrapping on very small screens
            marginBottom: '0.3rem',
            padding: '3.5rem',
            color: '#fff',
          }}
        >
          <FormControl variant="filled" size="small" sx={{ minWidth: 100, backgroundColor: alpha('#fff', 0.1) }}>
            <InputLabel sx={{ color: '#fff' }}>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
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
              onChange={(e) => setFilters((prev) => ({ ...prev, species: e.target.value }))}
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
              onClick={() => setSortBy('name')}
              variant={sortBy === 'name' ? 'contained' : 'outlined'}
            >
              Sort by Name
            </StyledButton>
            <StyledButton
              onClick={() => setSortBy('origin')}
              variant={sortBy === 'origin' ? 'contained' : 'outlined'}
            >
              Sort by Origin
            </StyledButton>
          </ButtonGroup>
        </Box>

        {/* Cards - Responsive Grid */}
        <CardsGrid>
          <AnimatePresence>
            {sortedCharacters.map((character) => (
              <Card
                key={character.id}
                layout
                initial={{ opacity: 0, scale: 0.90 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
              >
                <div style={{ position: 'relative' }}>
                  {/* Circular Status Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: statusColors[character.status as keyof typeof statusColors] || '#9e9e9e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {t(`status.${character.status.toLowerCase()}`)}
                  </div>

                  {/* Card Content */}
                  <div style={{ paddingLeft: '80px', paddingTop: '10px' }}>
                    <h3 className="text-lg font-bold mb-1">{character.name}</h3>
                    <div className="space-y-1 text-sm">
                      <div>
                        <PersonIcon fontSize="small" className="mr-1" />
                        {t('character.species')}: {character.species}
                      </div>
                      <div>
                        <GenderIcon gender={character.gender} />
                        {t('character.gender')}: {t(`gender.${character.gender.toLowerCase()}`)}
                      </div>
                      <div>
                        <GlobeIcon fontSize="small" className="mr-1" />
                        {t('character.origin')}: {character.origin.name}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </AnimatePresence>
        </CardsGrid>

        {/* Infinite scroll loading */}
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