import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";

const BioTable = props => {
  const { first_name, email, phone, id, role, date, status } = props || {};

  return (
    <Paper style={{ marginBottom: "20px" }} className="card-brdr">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="txt-s">Name</TableCell>
            <TableCell className="txt-s">Email</TableCell>
            <TableCell className="txt-s">Phone</TableCell>
            <TableCell className="txt-s">Account</TableCell>
            <TableCell className="txt-s">Pro Status</TableCell>
            <TableCell className="txt-s">Created At</TableCell>
            <TableCell className="txt-s">Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className="txt-s">{first_name}</TableCell>
            <TableCell className="txt-s">{email}</TableCell>
            <TableCell className="txt-s">{phone}</TableCell>
            <TableCell className="txt-s">{id}</TableCell>
            {role === "INVESTOR" ? (
              <TableCell className="txt-s">Pro-Investor</TableCell>
            ) : role === "BROKER_DEALER" ? (
              <TableCell className="txt-s">Broker Dealer</TableCell>
            ) : (
              <TableCell className="txt-s">Market Maker</TableCell>
            )}
            <TableCell className="txt-s">{date.slice(0, 10)}</TableCell>
            <TableCell className="txt-s">{status}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default BioTable;
