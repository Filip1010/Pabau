import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        title: 'Rick and Morty Universe',
        subtitle: 'Explore characters from across the multiverse',
        filters: {
          title: 'Filters & Sorting',
          status: 'Status',
          species: 'Species',
          allStatuses: 'All Statuses',
          speciesPlaceholder: 'Human, Alien, etc.'
        },
        status: {
          alive: 'Alive',
          dead: 'Dead',
          unknown: 'Unknown'
        },
        sorting: {
          title: 'Sort By',
          name: 'Name',
          origin: 'Origin'
        },
        character: {
          species: 'Species',
          gender: 'Gender',
          origin: 'Origin'
        },
        gender: {
          female: 'Female',
          male: 'Male',
          genderless: 'Genderless',
          unknown: 'Unknown'
        },
        error: 'Error'
      }
    },
    de: {
      translation: {
        title: 'Rick und Morty Universum',
        subtitle: 'Entdecke Charaktere aus dem Multiversum',
        // Add German translations...
      }
    },
    es: {
      translation: {
        title: 'Universo de Rick y Morty',
        subtitle: 'Explora personajes del multiverso',
        // Add Spanish translations...
      }
    }
  },
  lng: 'en',
  fallbackLng: 'en'
});

export default i18n;