import React from "react";
import "./styles.css";
import IconSearch from "../../../img/iconSearch.svg";
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
  const filter = () => {
    handleSubmit();
    setCurrentPage(1);
  };
  return (
    <div className="containerSorter">
      <label className="search-input">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <IconSearch alt="" />
      </label>
      <div className="buttons">
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
        <button onClick={filter}>FILTER</button>
      </div>
    </div>
  );
};
