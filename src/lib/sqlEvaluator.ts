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
 * Evaluates student's query against expected query result on the same seed data.
 */
export async function evaluateSolution(
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
