import initSqlJs, { type Database } from 'sql.js';
import path from 'path';
import fs from 'fs';

export interface QueryResult {
  columns: string[];
  values: any[][];
  error?: string;
}

export interface EvaluationResult {
  passed: boolean;
  message: string;
  userResult?: QueryResult;
  expectedResult?: QueryResult;
}

let sqlInstancePromise: Promise<any> | null = null;

async function loadWasmBinary(): Promise<ArrayBuffer | undefined> {
  const possiblePaths = [
    path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm'),
    path.join(process.cwd(), 'sql-wasm.wasm'),
    '/var/task/node_modules/sql.js/dist/sql-wasm.wasm',
    '/var/task/sql-wasm.wasm',
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      const buf = fs.readFileSync(p);
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    }
  }

  try {
    const response = await fetch('https://sql.js.org/dist/sql-wasm.wasm');
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (e) {
    console.warn('WASM fetch from CDN failed in sqlEvaluator:', e);
    return undefined;
  }
}

async function getSqlEngine() {
  if (!sqlInstancePromise) {
    sqlInstancePromise = (async () => {
      const wasmBinary = await loadWasmBinary();
      return await initSqlJs(wasmBinary ? { wasmBinary } : undefined);
    })();
  }
  return await sqlInstancePromise;
}

/**
 * Executes seed SQL and query SQL in an isolated in-memory SQLite database.
 */
export async function executeQuery(seedSql: string = '', querySql: string = ''): Promise<QueryResult> {
  if (!querySql || !querySql.trim()) {
    return {
      columns: [],
      values: [],
      error: 'Query SQL tidak boleh kosong.',
    };
  }

  let db: Database | null = null;
  try {
    const SQL = await getSqlEngine();
    const instance = new SQL.Database();
    db = instance;

    // Run seed SQL if provided
    if (seedSql && seedSql.trim()) {
      instance.run(seedSql);
    }

    // Execute user query
    const results = instance.exec(querySql);

    if (!results || results.length === 0) {
      return {
        columns: [],
        values: [],
      };
    }

    // Return the last statement's query result
    const lastResult = results[results.length - 1];
    return {
      columns: lastResult.columns || [],
      values: lastResult.values || [],
    };
  } catch (err: any) {
    return {
      columns: [],
      values: [],
      error: err.message || String(err),
    };
  } finally {
    if (db) {
      try {
        db.close();
      } catch (e) {
        // ignore close error
      }
    }
  }
}

/**
 * Normalizes values for consistent comparisons between query results.
 */
function canonicalizeValue(val: any): any {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return String(val).trim();
}

/**
 * Evaluates DDL schema exercises (CREATE TABLE, ALTER TABLE, CREATE VIEW, etc.)
 * by inspecting sqlite_master catalog, PRAGMA table_info, foreign keys, and indexes.
 */
interface TableColumn {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}

interface ForeignKeyInfo {
  id: number;
  seq: number;
  table: string;
  from: string;
  to: string;
}

function normalizeType(typeStr: string): string {
  const t = (typeStr || '').trim().toUpperCase();
  if (!t) return '';
  if (['INT', 'INTEGER', 'BIGINT', 'SMALLINT', 'TINYINT', 'MEDIUMINT'].includes(t)) return 'INT';
  if (['TEXT', 'VARCHAR', 'CHAR', 'CLOB'].some((prefix) => t.startsWith(prefix))) return 'TEXT';
  if (['REAL', 'FLOAT', 'DOUBLE', 'DECIMAL', 'NUMERIC'].some((prefix) => t.startsWith(prefix))) return 'REAL';
  if (t.startsWith('BLOB')) return 'BLOB';
  return t;
}

function isCompatibleType(userType: string, expType: string): boolean {
  const normUser = normalizeType(userType);
  const normExp = normalizeType(expType);
  if (!normExp) return true;
  return normUser === normExp;
}

function normalizeDefaultVal(val: any): string | null {
  if (val === null || val === undefined) return null;
  let str = String(val).trim();
  if ((str.startsWith("'") && str.endsWith("'")) || (str.startsWith('"') && str.endsWith('"'))) {
    str = str.substring(1, str.length - 1);
  }
  return str.toLowerCase();
}

export async function evaluateSchema(
  seedSql: string = '',
  expectedSql: string = '',
  userSql: string = ''
): Promise<EvaluationResult> {
  if (!userSql || !userSql.trim()) {
    return {
      passed: false,
      message: 'Query SQL siswa tidak boleh kosong.',
    };
  }

  if (!expectedSql || !expectedSql.trim()) {
    return {
      passed: false,
      message: 'Expected SQL tidak ditemukan.',
    };
  }

  let expDbRef: Database | null = null;
  let userDbRef: Database | null = null;

  try {
    const SQL = await getSqlEngine();

    // 1. Setup expected database
    const expDb: Database = new SQL.Database();
    expDbRef = expDb;
    if (seedSql && seedSql.trim()) {
      expDb.run(seedSql);
    }
    try {
      expDb.run(expectedSql);
    } catch (err: any) {
      return {
        passed: false,
        message: `Kesalahan pada query referensi DDL: ${err.message || String(err)}`,
      };
    }

    // 2. Setup user database
    const userDb: Database = new SQL.Database();
    userDbRef = userDb;
    if (seedSql && seedSql.trim()) {
      userDb.run(seedSql);
    }
    try {
      userDb.run(userSql);
    } catch (err: any) {
      return {
        passed: false,
        message: `Kesalahan eksekusi query DDL Anda: ${err.message || String(err)}`,
        userResult: { columns: [], values: [], error: err.message || String(err) },
      };
    }

    // 3. Helper to get catalog objects from a database
    const getCatalogObjects = (db: Database) => {
      const res = db.exec("SELECT type, name, sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name");
      if (!res || res.length === 0) return [];
      return res[0].values.map((row) => ({
        type: String(row[0]),
        name: String(row[1]),
        sql: String(row[2] || ''),
      }));
    };

    const expObjects = getCatalogObjects(expDb);
    const userObjects = getCatalogObjects(userDb);

    const formatSchemaQueryResult = (objects: { type: string; name: string; sql: string }[]): QueryResult => ({
      columns: ['type', 'name', 'sql'],
      values: objects.map((o) => [o.type, o.name, o.sql]),
    });

    const expectedQueryResult = formatSchemaQueryResult(expObjects);
    const userQueryResult = formatSchemaQueryResult(userObjects);

    const expObjMap = new Map(expObjects.map((o) => [o.name.toLowerCase(), o]));
    const userObjMap = new Map(userObjects.map((o) => [o.name.toLowerCase(), o]));

    // 4. Verify all expected objects exist in user DB
    for (const [nameLower, expObj] of expObjMap.entries()) {
      const userObj = userObjMap.get(nameLower);
      if (!userObj) {
        return {
          passed: false,
          message: `Tabel atau view '${expObj.name}' tidak ditemukan pada struktur database Anda.`,
          userResult: userQueryResult,
          expectedResult: expectedQueryResult,
        };
      }
      if (userObj.type !== expObj.type) {
        return {
          passed: false,
          message: `Objek '${expObj.name}' seharusnya berupa ${expObj.type}, bukan ${userObj.type}.`,
          userResult: userQueryResult,
          expectedResult: expectedQueryResult,
        };
      }
    }

    // 5. Verify no extra unexpected objects in user DB
    for (const [nameLower, userObj] of userObjMap.entries()) {
      if (!expObjMap.has(nameLower)) {
        return {
          passed: false,
          message: `Terdapat objek database '${userObj.name}' yang tidak sesuai dengan instruksi.`,
          userResult: userQueryResult,
          expectedResult: expectedQueryResult,
        };
      }
    }

    // 6. Deep inspection for each object
    for (const expObj of expObjects) {
      const tableName = expObj.name;
      const objectType = expObj.type;

      if (objectType === 'view') {
        const expViewInfoRes = expDb.exec(`PRAGMA table_info("${tableName}")`);
        const userViewInfoRes = userDb.exec(`PRAGMA table_info("${tableName}")`);

        const expViewCols = expViewInfoRes.length > 0 ? expViewInfoRes[0].values.map((r) => String(r[1]).toLowerCase()) : [];
        const userViewCols = userViewInfoRes.length > 0 ? userViewInfoRes[0].values.map((r) => String(r[1]).toLowerCase()) : [];

        if (userViewCols.length !== expViewCols.length) {
          return {
            passed: false,
            message: `Jumlah kolom pada view '${tableName}' (${userViewCols.length}) tidak sesuai dengan yang diharapkan (${expViewCols.length}).`,
            userResult: userQueryResult,
            expectedResult: expectedQueryResult,
          };
        }

        try {
          const expViewData = expDb.exec(`SELECT * FROM "${tableName}"`);
          const userViewData = userDb.exec(`SELECT * FROM "${tableName}"`);
          const expRows = expViewData.length > 0 ? expViewData[0].values : [];
          const userRows = userViewData.length > 0 ? userViewData[0].values : [];

          if (JSON.stringify(userRows) !== JSON.stringify(expRows)) {
            return {
              passed: false,
              message: `Hasil query dari view '${tableName}' tidak sesuai dengan data yang diharapkan.`,
              userResult: userQueryResult,
              expectedResult: expectedQueryResult,
            };
          }
        } catch (vErr: any) {
          return {
            passed: false,
            message: `Gagal mengeksekusi view '${tableName}': ${vErr.message || String(vErr)}`,
            userResult: userQueryResult,
            expectedResult: expectedQueryResult,
          };
        }
      } else if (objectType === 'table') {
        const getTableCols = (db: Database, name: string): TableColumn[] => {
          const res = db.exec(`PRAGMA table_info("${name}")`);
          if (!res || res.length === 0) return [];
          return res[0].values.map((r) => ({
            cid: Number(r[0]),
            name: String(r[1]),
            type: String(r[2]),
            notnull: Number(r[3]),
            dflt_value: r[4],
            pk: Number(r[5]),
          }));
        };

        const expCols = getTableCols(expDb, tableName);
        const userCols = getTableCols(userDb, tableName);

        if (userCols.length !== expCols.length) {
          return {
            passed: false,
            message: `Jumlah kolom pada tabel '${tableName}' (${userCols.length}) tidak sesuai dengan yang diharapkan (${expCols.length}).`,
            userResult: userQueryResult,
            expectedResult: expectedQueryResult,
          };
        }

        for (let i = 0; i < expCols.length; i++) {
          const expCol = expCols[i];
          const userCol = userCols[i];

          if (userCol.name.toLowerCase() !== expCol.name.toLowerCase()) {
            return {
              passed: false,
              message: `Nama/urutan kolom pada tabel '${tableName}' (${userCols.map((c) => c.name).join(', ')}) tidak sesuai dengan yang diharapkan (${expCols.map((c) => c.name).join(', ')}).`,
              userResult: userQueryResult,
              expectedResult: expectedQueryResult,
            };
          }

          if (expCol.type && !isCompatibleType(userCol.type, expCol.type)) {
            return {
              passed: false,
              message: `Tipe data kolom '${expCol.name}' pada tabel '${tableName}' (${userCol.type}) tidak sesuai dengan yang diharapkan (${expCol.type}).`,
              userResult: userQueryResult,
              expectedResult: expectedQueryResult,
            };
          }

          if (expCol.notnull === 1 && userCol.notnull !== 1) {
            return {
              passed: false,
              message: `Kolom '${expCol.name}' pada tabel '${tableName}' harus memiliki batasan NOT NULL.`,
              userResult: userQueryResult,
              expectedResult: expectedQueryResult,
            };
          }

          if (expCol.pk > 0 && userCol.pk === 0) {
            return {
              passed: false,
              message: `Kolom '${expCol.name}' pada tabel '${tableName}' harus ditetapkan sebagai PRIMARY KEY.`,
              userResult: userQueryResult,
              expectedResult: expectedQueryResult,
            };
          }

          if (expCol.dflt_value !== null && expCol.dflt_value !== undefined) {
            const expDefNorm = normalizeDefaultVal(expCol.dflt_value);
            const userDefNorm = normalizeDefaultVal(userCol.dflt_value);
            if (expDefNorm !== userDefNorm) {
              return {
                passed: false,
                message: `Kolom '${expCol.name}' pada tabel '${tableName}' harus memiliki nilai DEFAULT ${expCol.dflt_value}.`,
                userResult: userQueryResult,
                expectedResult: expectedQueryResult,
              };
            }
          }
        }

        const getForeignKeys = (db: Database, name: string): ForeignKeyInfo[] => {
          const res = db.exec(`PRAGMA foreign_key_list("${name}")`);
          if (!res || res.length === 0) return [];
          return res[0].values.map((r) => ({
            id: Number(r[0]),
            seq: Number(r[1]),
            table: String(r[2]),
            from: String(r[3]),
            to: String(r[4]),
          }));
        };

        const expFks = getForeignKeys(expDb, tableName);
        const userFks = getForeignKeys(userDb, tableName);

        for (const expFk of expFks) {
          const matchedFk = userFks.find(
            (f) =>
              f.table.toLowerCase() === expFk.table.toLowerCase() &&
              f.from.toLowerCase() === expFk.from.toLowerCase() &&
              f.to.toLowerCase() === expFk.to.toLowerCase()
          );
          if (!matchedFk) {
            return {
              passed: false,
              message: `Tabel '${tableName}' harus memiliki batasan FOREIGN KEY pada kolom '${expFk.from}' yang merujuk ke ${expFk.table}(${expFk.to}).`,
              userResult: userQueryResult,
              expectedResult: expectedQueryResult,
            };
          }
        }

        const getUniqueIndexes = (db: Database, name: string) => {
          const res = db.exec(`PRAGMA index_list("${name}")`);
          if (!res || res.length === 0) return [];
          const uniqueIndexes = res[0].values.filter((r) => Number(r[2]) === 1 && String(r[3]) !== 'pk');
          const cols: string[] = [];
          for (const idx of uniqueIndexes) {
            const idxName = String(idx[1]);
            const info = db.exec(`PRAGMA index_info("${idxName}")`);
            if (info && info.length > 0) {
              for (const row of info[0].values) {
                cols.push(String(row[2]).toLowerCase());
              }
            }
          }
          return cols;
        };

        const expUniques = getUniqueIndexes(expDb, tableName);
        const userUniques = getUniqueIndexes(userDb, tableName);

        for (const expColUnique of expUniques) {
          if (!userUniques.includes(expColUnique)) {
            return {
              passed: false,
              message: `Kolom '${expColUnique}' pada tabel '${tableName}' harus memiliki batasan UNIQUE.`,
              userResult: userQueryResult,
              expectedResult: expectedQueryResult,
            };
          }
        }
      }
    }

    return {
      passed: true,
      message: 'Jawaban DDL Anda benar! Struktur database berhasil dibuat sesuai spesifikasi.',
      userResult: userQueryResult,
      expectedResult: expectedQueryResult,
    };
  } catch (err: any) {
    return {
      passed: false,
      message: `Kesalahan evaluasi schema: ${err.message || String(err)}`,
    };
  } finally {
    if (expDbRef) {
      try {
        expDbRef.close();
      } catch (e) {}
    }
    if (userDbRef) {
      try {
        userDbRef.close();
      } catch (e) {}
    }
  }
}

/**
 * Evaluates student's query against expected query result or schema.
 */
export async function evaluateSolution(
  seedSql: string = '',
  expectedSql: string = '',
  userSql: string = '',
  evaluatorType: string = 'data_match'
): Promise<EvaluationResult> {
  if (evaluatorType === 'schema_match') {
    return await evaluateSchema(seedSql, expectedSql, userSql);
  }

  if (!userSql || !userSql.trim()) {
    return {
      passed: false,
      message: 'Query SQL siswa tidak boleh kosong.',
    };
  }

  if (!expectedSql || !expectedSql.trim()) {
    return {
      passed: false,
      message: 'Expected SQL tidak ditemukan.',
    };
  }

  // 1. Execute expected query
  const expectedResult = await executeQuery(seedSql, expectedSql);
  if (expectedResult.error) {
    return {
      passed: false,
      message: `Kesalahan pada query referensi: ${expectedResult.error}`,
      expectedResult,
    };
  }

  // 2. Execute user query
  const userResult = await executeQuery(seedSql, userSql);
  if (userResult.error) {
    return {
      passed: false,
      message: `Kesalahan eksekusi query Anda: ${userResult.error}`,
      userResult,
      expectedResult,
    };
  }

  // 3. Compare column count
  if (userResult.columns.length !== expectedResult.columns.length) {
    return {
      passed: false,
      message: `Jumlah kolom (${userResult.columns.length}) tidak sesuai dengan yang diharapkan (${expectedResult.columns.length}).`,
      userResult,
      expectedResult,
    };
  }

  // 4. Compare column names (case-insensitive comparison)
  const userColsLower = userResult.columns.map((c) => c.toLowerCase());
  const expectedColsLower = expectedResult.columns.map((c) => c.toLowerCase());
  for (let i = 0; i < userColsLower.length; i++) {
    if (userColsLower[i] !== expectedColsLower[i]) {
      return {
        passed: false,
        message: `Nama/urutan kolom (${userResult.columns.join(', ')}) tidak sesuai dengan yang diharapkan (${expectedResult.columns.join(', ')}).`,
        userResult,
        expectedResult,
      };
    }
  }

  // 5. Compare row count
  if (userResult.values.length !== expectedResult.values.length) {
    return {
      passed: false,
      message: `Jumlah baris data (${userResult.values.length}) tidak sesuai dengan jawaban yang diharapkan (${expectedResult.values.length}).`,
      userResult,
      expectedResult,
    };
  }

  // 6. Compare values
  const canonicalUserRows = userResult.values.map((row) => row.map(canonicalizeValue));
  const canonicalExpRows = expectedResult.values.map((row) => row.map(canonicalizeValue));

  const isExactMatch = JSON.stringify(canonicalUserRows) === JSON.stringify(canonicalExpRows);

  if (isExactMatch) {
    return {
      passed: true,
      message: 'Jawaban Anda benar! Selamat!',
      userResult,
      expectedResult,
    };
  }

  // Check if expected SQL has ORDER BY
  const hasOrderBy = expectedSql.toLowerCase().includes('order by');
  if (!hasOrderBy) {
    // If order was not required, sort rows before comparing
    const sortKey = (row: any[]) => JSON.stringify(row);
    const sortedUser = [...canonicalUserRows].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
    const sortedExp = [...canonicalExpRows].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

    if (JSON.stringify(sortedUser) === JSON.stringify(sortedExp)) {
      return {
        passed: true,
        message: 'Jawaban Anda benar! Selamat!',
        userResult,
        expectedResult,
      };
    }
  }

  return {
    passed: false,
    message: 'Nilai data hasil query Anda belum sesuai dengan jawaban yang diharapkan.',
    userResult,
    expectedResult,
  };
}

