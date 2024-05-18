import * as fs from 'fs';

export const getAllCountries = async () => {
  const countries: any[] = await JSON.parse(
    fs.readFileSync('src/ubication/data/countries.json', 'utf-8'),
  );
  return countries.map((country) => {
    return {
      id: country.id,
      name: country.name,
    };
  });
};

export const getStatesCountry = async (id: number) => {
  const states: any[] = await JSON.parse(
    fs.readFileSync('src/ubication/data/states.json', 'utf-8'),
  );
  const statesToReturn = states
    .filter((state) => state.country_id === id)
    .map((state) => {
      return {
        id: state.id,
        name: state.name,
        country_id: state.country_id,
      };
    });
  return statesToReturn;
};

export const showUbication = async (id_country: number, id_state: number) => {
  const states = await getStatesCountry(id_country);
  const sortedStates = states.sort((a, b) => a.name - b.name);
  const otherStates = sortedStates.map((state) => state.id);

  if (!id_state || Number.isNaN(id_state))
    id_state = sortedStates.length > 0 ? sortedStates[0].id : -1;

  const state = states.find((state) => state.id === id_state);
  if (!state) throw new Error('Estado no encontrado dentro del pais');

  const cities = await findCitiesByStateId(id_state);
  return {
    state,
    cities,
    states: otherStates,
  };
};

async function findCitiesByStateId(id: number) {
  const cities: any[] = await JSON.parse(
    fs.readFileSync('src/ubication/data/cities.json', 'utf-8'),
  );
  const citiesToReturn = cities
    .filter((city) => city.state_id === id)
    .map((city) => {
      return {
        id: city.id,
        name: city.name,
      };
    });
  return citiesToReturn;
}
