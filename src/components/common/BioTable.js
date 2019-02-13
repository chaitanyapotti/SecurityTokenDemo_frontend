import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";

const BioTable = props => {
  const { first_name, email, phone, id, role, date, status } = props || {};

  return (
    <Paper style={{ marginBottom: "20px" }} className="card-brdr">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Name</TableCell>
            <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Email</TableCell>
            <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Phone</TableCell>
            <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Account</TableCell>
            <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Pro Status</TableCell>
            <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Created At</TableCell>
            <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className="txt-s table-text-pad">{first_name}</TableCell>
            <TableCell className="txt-s table-text-pad">{email}</TableCell>
            <TableCell className="txt-s table-text-pad">{phone}</TableCell>
            <TableCell className="txt-s table-text-pad">{id}</TableCell>
            {role === "INVESTOR" ? (
              <TableCell className="txt-s table-text-pad">Pro-Investor</TableCell>
            ) : role === "BROKER_DEALER" ? (
              <TableCell className="txt-s table-text-pad">Broker Dealer</TableCell>
            ) : (
              <TableCell className="txt-s table-text-pad">Market Maker</TableCell>
            )}
            <TableCell className="txt-s table-text-pad">{date.slice(0, 10)}</TableCell>
            <TableCell className="txt-s table-text-pad">{status}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default BioTable;
