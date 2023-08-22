import React, { Fragment, useContext } from 'react';
import styles from './NftPaymentTicket.module.css';

export const NftPaymentTicket = ({ ticket }) => {
  console.log(ticket, 'TICKET');
  if (!ticket) {
    return null; // Devolver null si no hay ticket
  }

  return (
    <Fragment>
      <h1>Amount</h1>
      <p>{ticket.amount ? ticket.amount : 'Amount not available'}</p>

      <h1>ticketID</h1>
      <p>
        {ticket.payment_id ? ticket.payment_id : 'payment id not available'}
      </p>

      <h1>Description</h1>
      <p>
        {ticket.description ? ticket.description : 'Description not available'}
      </p>

      <h1>Currency</h1>
      <p>{ticket.currency ? ticket.currency : 'Currency not available'}</p>

      <h1>Metadata</h1>
      {ticket.metadata && Object.keys(ticket.metadata).length > 0 ? (
        <ul>
          {Object.entries(ticket.metadata).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      ) : (
        <p>No metadata available</p>
      )}
    </Fragment>
  );
};
