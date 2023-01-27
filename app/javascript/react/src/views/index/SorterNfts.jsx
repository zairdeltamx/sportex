import React from "react";

export const SorterNfts = ({
  handleSubmit,
  orderBy,
  order,
  setOrder,
  setOrderBy,
  setName,
  name,
}) => {
  return (
    <div >
      <label style={{ color: "white" }}>
        Nombre:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label style={{ color: "white" }}>
        Ordenar por:
        <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
          <option value="">Seleccione</option>
          <option value="price">Price</option>
          <option value="defense">Defense</option>
          <option value="attack">Attack</option>
          <option value="strength">strength</option>
        </select>
      </label>
      <label style={{ color: "white" }}>
        Orden:
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="">Seleccione</option>
          <option value="ASC">Ascendente</option>
          <option value="DESC">Descendente</option>
        </select>
      </label>
      <button onClick={handleSubmit}>Filtrar</button>
    </div>
  );
};
