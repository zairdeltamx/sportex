import React, { useState } from "react";
import IconSearch from "../../../img/iconSearch.svg";
import ToggleButton from '../../../img/toggleButton.svg';
export const SorterNfts = ({
  handleSubmit,
  orderBy,
  order,
  setOrder,
  setOrderBy,
  setName,
  name,
  teamName,
  setTeamName,
  setCurrentPage,
}) => {
  const [active, setActive] = useState(false)
  const filter = () => {
    handleSubmit();
    setCurrentPage(1);
  };

  const toggleSort = () => {
    setActive(!active)
  }
  return (
    <div>

      <div className='containerSorter'>
        <div className="container_search_input">

          <label className="search-input">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <IconSearch alt="" />
          </label>
        </div>
        <div className="container_buttons_and_toggle">
          <div className="toggle_sorter">
            <ToggleButton onClick={toggleSort} />
          </div>
          <div className={`buttons ${active ? "active" : ""}`}>
            <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
              <option value="">Category</option>
              <option value="price">Price</option>
              <option value="defense">Defense</option>
              <option value="attack">Attack</option>
              <option value="strength">strength</option>
            </select>

            <select value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="">Order</option>
              <option value="ASC">Ascendente</option>
              <option value="DESC">Descendente</option>
            </select>

            <select value={teamName} onChange={(e) => setTeamName(e.target.value)}>
              <option value="">Team</option>
              <option value="mexico">Mexico</option>
              <option value="italia">Italia</option>
            </select>
            <button className="button_cancel" onClick={() => setActive(false)}>Cancelar</button>
            <button className="button_filter" onClick={filter}>FILTER</button>
          </div>
        </div>


      </div >
    </div >
  );
};
