'use strict';

/**
 * Catalyst Data Store access for the WebLeads table.
 * Each website submission is saved here first, so a lead is never lost if Zoho is down.
 */

const TABLE = process.env.DATASTORE_TABLE || 'WebLeads';

function catalystStore(req) {
  // Loaded lazily so local tests can run without the Catalyst SDK.
  const catalyst = require('zcatalyst-sdk-node');
  const app = catalyst.initialize(req);
  const table = app.datastore().table(TABLE);
  const zcql = app.zcql();

  return {
    async insert(row) {
      const saved = await table.insertRow(row);
      return saved.ROWID;
    },
    async update(rowId, changes) {
      await table.updateRow({ ROWID: rowId, ...changes });
    },
    async get(rowId) {
      return table.getRow(rowId);
    },
    /** status: pending | synced | note_added | failed */
    async listByStatus(statuses, limit = 50, maxAttempts = 1000) {
      const list = statuses.map((s) => `'${String(s).replace(/[^a-z_]/g, '')}'`).join(',');
      const lim = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 300);
      const max = Math.max(parseInt(maxAttempts, 10) || 0, 0);
      const q = `SELECT * FROM ${TABLE} WHERE zoho_status IN (${list}) AND attempts < ${max} ORDER BY CREATEDTIME DESC LIMIT ${lim}`;
      const rows = await zcql.executeZCQLQuery(q);
      return rows.map((r) => r[TABLE]);
    },
  };
}

module.exports = { catalystStore, TABLE };
