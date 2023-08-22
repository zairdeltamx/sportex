import React, { useEffect, useState } from 'react';
import IconSearch from '../../img/iconSearch.svg';
import Menu from '../../img/navbar/menu.svg';
import CloseMenu from '../../img/navbar/closeMenu.svg';
import styles from './SorterNfts.module.css';
import { useGetTeams } from '../../graphql/teams/custom-hooks';
export const SorterNfts = ({
  handleSubmit,
  orderBy,
  order,
  fetchNFTsData,
  setOrder,
  setOrderBy,
  setName,
  name,
  setTeamName,
  setCurrentPage,
  setsearchForSeller,
}) => {
  const [active, setActive] = useState(false);
  const { teams } = useGetTeams();

  const filter = () => {
    fetchNFTsData();
    setCurrentPage(1);
  };
  const toggleSort = () => {
    setActive(!active);
  };
  return (
    <div>
      <div className={styles.containerSorter}>
        <div className={styles.containerSearchInput}>
          <label className={styles.searchInput}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <IconSearch alt="" />
          </label>
          <label htmlFor="seller">
            Show my NFT listings
            <input
              type="checkbox"
              name=""
              onChange={(ev) => {
                setsearchForSeller(ev.target.checked);
              }}
              id="seller"
            />
          </label>
        </div>
        <div className={styles.containerButtonsAndToggle}>
          <div className={styles.toggleSorter}>
            {!active ? (
              <Menu onClick={toggleSort} />
            ) : (
              <CloseMenu onClick={toggleSort} />
            )}
          </div>
          <div
            className={`${styles.containerButtons} ${
              active ? styles.active : ''
            }`}
          >
            <div className={styles.buttons}>
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <option value="">Category</option>
                <option value="price">Price</option>
                <option value="tokenId">TokenId</option>
                <option value="defense">Defense</option>
                <option value="attack">Attack</option>
                <option value="strength">Strength</option>
              </select>

              <select value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value="">Order</option>
                <option value="ASC">Ascendente</option>
                <option value="DESC">Descendente</option>
              </select>

              <select onChange={(e) => setTeamName(e.target.value)}>
                <option value="">Team</option>
                {teams?.map((team, index) => (
                  <option key={index} value={team}>
                    {team}
                  </option>
                ))}
              </select>
              <button
                className={styles.buttonCancel}
                onClick={() => setActive(false)}
              >
                Cancelar
              </button>
              <button className={styles.buttonFilter} onClick={filter}>
                FILTER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
