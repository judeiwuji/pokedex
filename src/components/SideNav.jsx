import { useState } from 'react';
import { first151Pokemon, getFullPokedexNumber } from '../utils';

function SideNav(props) {
  const {
    selectedPokemon,
    setSelectedPokemon,
    handleToggleMenu,
    showSideMenu,
  } = props;
  const [searchValue, setSearchValue] = useState('');
  const filteredPokemon = first151Pokemon.filter((value, valueIndex) => {
    if (toString(getFullPokedexNumber(valueIndex)).includes(searchValue)) {
      return true;
    }

    if (value.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }

    return false;
  });
  return (
    <nav className={' ' + (!showSideMenu ? ' open' : '')}>
      <div className={'header' + (!showSideMenu ? ' open' : '')}>
        <button className='open-nav-button' onClick={handleToggleMenu}>
          <i className='fa-solid fa-arrow-left-long'></i>
        </button>
        <h1 className='text-gradient'>Pokédex</h1>
      </div>
      <input
        placeholder='E.G. 001 or Bulba...'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {filteredPokemon.map((pokemon, pokemonIndex) => {
        const truePokemonIndex = first151Pokemon.indexOf(pokemon);

        return (
          <button
            onClick={() => {
              setSelectedPokemon(truePokemonIndex);
              handleToggleMenu();
            }}
            key={pokemonIndex}
            className={
              'nav-card ' +
              (truePokemonIndex === selectedPokemon ? 'nav-card-selected' : '')
            }
          >
            <p>{getFullPokedexNumber(truePokemonIndex)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}

export default SideNav;
