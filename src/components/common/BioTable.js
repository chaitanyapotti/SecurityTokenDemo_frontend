import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";

const BioTable = props => {
  const { first_name, email, phone, id, role, date, status } = props || {};

  return (
    <Paper style={{ marginBottom: "20px" }} className="card-brdr">
      <Table celled>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Pro Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{first_name}</TableCell>
            <TableCell>{email}</TableCell>
            <TableCell>{phone}</TableCell>
            <TableCell>{id}</TableCell>
            {role === "INVESTOR" ? (
              <TableCell>Pro-Investor</TableCell>
            ) : role === "BROKER_DEALER" ? (
              <TableCell>Broker Dealer</TableCell>
            ) : (
              <TableCell>Market Maker</TableCell>
            )}
            <TableCell>{date.slice(0, 10)}</TableCell>
            <TableCell>{status}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default BioTable;
