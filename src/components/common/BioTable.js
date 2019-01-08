import React from "react";
import { Table } from "semantic-ui-react";

const BioTable = props => {
  const { first_name, email, phone, id, role, date, status } = props || {};

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Phone</Table.HeaderCell>
          <Table.HeaderCell>Account</Table.HeaderCell>
          <Table.HeaderCell>Pro Status</Table.HeaderCell>
          <Table.HeaderCell>Created At</Table.HeaderCell>
          <Table.HeaderCell>Active</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>{first_name}</Table.Cell>
          <Table.Cell>{email}</Table.Cell>
          <Table.Cell>{phone}</Table.Cell>
          <Table.Cell>{id}</Table.Cell>
          {role === "INVESTOR" ? (
            <Table.Cell>Investor</Table.Cell>
          ) : role === "BROKER_DEALER" ? (
            <Table.Cell>Broker Dealer</Table.Cell>
          ) : (
            <Table.Cell>Market Maker</Table.Cell>
          )}
          <Table.Cell>{date.slice(0, 10)}</Table.Cell>
          <Table.Cell>{status}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default BioTable;
