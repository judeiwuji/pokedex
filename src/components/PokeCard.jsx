import { useEffect, useState } from 'react';
import { getFullPokedexNumber, getPokedexNumber } from '../utils';
import TypeCard from './TypeCard';
import Modal from './Modal';

function PokeCard(props) {
  const { selectedPokemon } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const DB_KEY = 'pokedex';
  const MOVE_DB_KEY = `pokedex-moves`;
  const { name, height, abilities, types, weight, sprites, stats, moves } =
    data || {};
  const imgList = Object.keys(sprites || {}).filter((key) => {
    if (!sprites[key]) return false;
    if (['versions', 'other'].includes(key)) return false;
    return true;
  });
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !moveUrl || !localStorage) return;

    let cache = {};
    if (localStorage.getItem(MOVE_DB_KEY)) {
      cache = JSON.parse(localStorage.getItem(MOVE_DB_KEY));
    }

    if (move in cache) {
      setSkill(cache[move]);
      console.log('Found move in cache');
      return;
    }

    try {
      setLoadingSkill(true);
      const response = await fetch(moveUrl);
      const moveData = await response.json();
      console.log('Fetched move from API', moveData);
      const description = moveData?.flavor_text_entries.filter((value) => {
        return value.version_group.name === 'firered-leafgreen';
      })[0]?.flavor_text;
      const skillData = {
        name: move,
        description,
      };
      setSkill(skillData);
      cache[move] = skillData;
      localStorage.setItem(MOVE_DB_KEY, JSON.stringify(cache));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    if (loading || !localStorage) return;

    let cache = {};
    let DB = localStorage.getItem(DB_KEY);
    if (DB) {
      cache = JSON.parse(DB);
    }

    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon]);
      console.log('Found pokemon in cache');
      return;
    }

    async function fetchPokemon(selectedPokemon) {
      setLoading(true);

      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${getPokedexNumber(
          selectedPokemon
        )}`;
        const response = await fetch(url);
        const pokemonData = await response.json();
        setData(pokemonData);

        cache[selectedPokemon] = pokemonData;
        localStorage.setItem(DB_KEY, JSON.stringify(cache));
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon(selectedPokemon);
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className='poke-card'>
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}
        >
          <div>
            <h6>Name</h6>
            <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
          </div>

          <div>
            <h6>Description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>

      <div className='type-container'>
        {types.map(({ type }, typeIndex) => {
          return <TypeCard key={typeIndex} type={type?.name} />;
        })}
      </div>

      <img
        className='default-img'
        src={`/pokemon/${getFullPokedexNumber(selectedPokemon)}.png`}
        alt={`${name}-large-image`}
      />

      <div className='image-container'>
        {imgList.map((key, spriteIndex) => {
          return (
            <img
              key={spriteIndex}
              src={sprites[key]}
              alt={`${name}-image-${key}`}
            />
          );
        })}
      </div>

      <h3>Stats</h3>
      <div className='stats-card'>
        {stats.map(({ base_stat, stat }, statIndex) => {
          return (
            <div className='stat-item' key={statIndex}>
              <p>{stat?.name?.replaceAll('-', ' ')}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>

      <h3>Moves</h3>
      <div className='pokemon-move-grid'>
        {moves.map(({ move }, moveIndex) => {
          return (
            <button
              className='button-card pokemon-move'
              key={moveIndex}
              onClick={() => {
                fetchMoveData(move.name, move.url);
              }}
            >
              <p>{move?.name.replaceAll('-', ' ')}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PokeCard;
