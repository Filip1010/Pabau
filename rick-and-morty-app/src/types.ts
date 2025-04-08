export interface Character {
    id: string;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    gender: string;
    origin: {
      name: string;
    };
  }
  
  export interface CharactersData {
    characters: {
      info: {
        next: number | null;
      };
      results: Character[];
    };
  }
  
  export interface CharactersVars {
    page?: number;
    filter?: {
      status?: string;
      species?: string;
      name?: string;
    };
  }