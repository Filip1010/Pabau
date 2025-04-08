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
        error: 'Error',
        sortByName: 'Sort by Name',
        sortByOrigin: 'Sort by Origin',
        speciesLabel: 'Species',
        statusLabel: 'Status',
        all: 'All'
      }
    },
    de: {
      translation: {
        title: 'Rick und Morty Universum',
        subtitle: 'Entdecke Charaktere aus dem Multiversum',
        filters: {
          title: 'Filter & Sortierung',
          status: 'Status',
          species: 'Spezies',
          allStatuses: 'Alle Status',
          speciesPlaceholder: 'Mensch, Alien, usw.'
        },
        status: {
          alive: 'Lebendig',
          dead: 'Tot',
          unknown: 'Unbekannt'
        },
        sorting: {
          title: 'Sortieren nach',
          name: 'Name',
          origin: 'Herkunft'
        },
        character: {
          species: 'Spezies',
          gender: 'Geschlecht',
          origin: 'Herkunft'
        },
        gender: {
          female: 'Weiblich',
          male: 'Männlich',
          genderless: 'Geschlechtslos',
          unknown: 'Unbekannt'
        },
        error: 'Fehler',
        sortByName: 'Sortieren nach Name',
        sortByOrigin: 'Sortieren nach Herkunft',
        speciesLabel: 'Spezies',
        statusLabel: 'Status',
        all: 'Alle'
      }
    },
    es: {
      translation: {
        title: 'Universo de Rick y Morty',
        subtitle: 'Explora personajes del multiverso',
        filters: {
          title: 'Filtros y Orden',
          status: 'Estado',
          species: 'Especie',
          allStatuses: 'Todos los estados',
          speciesPlaceholder: 'Humano, Alienígena, etc.'
        },
        status: {
          alive: 'Vivo',
          dead: 'Muerto',
          unknown: 'Desconocido'
        },
        sorting: {
          title: 'Ordenar por',
          name: 'Nombre',
          origin: 'Origen'
        },
        character: {
          species: 'Especie',
          gender: 'Género',
          origin: 'Origen'
        },
        gender: {
          female: 'Femenino',
          male: 'Masculino',
          genderless: 'Sin género',
          unknown: 'Desconocido'
        },
        error: 'Error',
        sortByName: 'Ordenar por Nombre',
        sortByOrigin: 'Ordenar por Origen',
        speciesLabel: 'Especie',
        statusLabel: 'Estado',
        all: 'Todos'
      }
    }
  },
  lng: 'en',
  fallbackLng: 'en'
});

export default i18n;
