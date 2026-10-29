import { test } from 'node:test';
import assert from 'node:assert';
import { parseCSV, findDuplicates } from './csvParser.js';

test('parseCSV handles basic CSV data', () => {
  const csv = 'Title 1,Body 1\nTitle 2,Body 2';
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result[0], { title: 'Title 1', body: 'Body 1' });
  assert.deepStrictEqual(result[1], { title: 'Title 2', body: 'Body 2' });
});

test('parseCSV handles quoted commas', () => {
  const csv = '"Title, with comma","Body, also with comma"';
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    title: 'Title, with comma',
    body: 'Body, also with comma'
  });
});

test('parseCSV handles escaped quotes', () => {
  const csv = '"Title with ""quotes""","Body with ""quotes"" too"';
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    title: 'Title with "quotes"',
    body: 'Body with "quotes" too'
  });
});

test('parseCSV handles CRLF line endings', () => {
  const csv = 'Title 1,Body 1\r\nTitle 2,Body 2\r\nTitle 3,Body 3';
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 3);
  assert.deepStrictEqual(result[0], { title: 'Title 1', body: 'Body 1' });
  assert.deepStrictEqual(result[1], { title: 'Title 2', body: 'Body 2' });
  assert.deepStrictEqual(result[2], { title: 'Title 3', body: 'Body 3' });
});

test('parseCSV handles embedded newlines in quoted fields', () => {
  const csv = '"Title\nwith newline","Body\nwith\nmultiple newlines"';
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], {
    title: 'Title\nwith newline',
    body: 'Body\nwith\nmultiple newlines'
  });
});

test('parseCSV handles mixed quoted and unquoted fields', () => {
  const csv = 'Simple Title,"Body, with comma"\n"Title, with comma",Simple Body';
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result[0], { title: 'Simple Title', body: 'Body, with comma' });
  assert.deepStrictEqual(result[1], { title: 'Title, with comma', body: 'Simple Body' });
});

test('parseCSV handles empty lines', () => {
  const csv = 'Title 1,Body 1\n\nTitle 2,Body 2\n\n\n';
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result[0], { title: 'Title 1', body: 'Body 1' });
  assert.deepStrictEqual(result[1], { title: 'Title 2', body: 'Body 2' });
});

test('parseCSV handles whitespace trimming', () => {
  const csv = '  Title 1  ,  Body 1  \n  Title 2  ,  Body 2  ';
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result[0], { title: 'Title 1', body: 'Body 1' });
  assert.deepStrictEqual(result[1], { title: 'Title 2', body: 'Body 2' });
});

test('parseCSV handles rows with more than 2 columns (ignores extra)', () => {
  const csv = 'Title 1,Body 1,Extra 1\nTitle 2,Body 2,Extra 2,Extra 3';
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result[0], { title: 'Title 1', body: 'Body 1' });
  assert.deepStrictEqual(result[1], { title: 'Title 2', body: 'Body 2' });
});

test('parseCSV handles rows with only 1 column (filters out)', () => {
  const csv = 'Title 1,Body 1\nOnly Title\nTitle 2,Body 2';
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result[0], { title: 'Title 1', body: 'Body 1' });
  assert.deepStrictEqual(result[1], { title: 'Title 2', body: 'Body 2' });
});

test('parseCSV handles empty string', () => {
  const result = parseCSV('');
  assert.strictEqual(result.length, 0);
});

test('parseCSV handles null/undefined input', () => {
  assert.strictEqual(parseCSV(null).length, 0);
  assert.strictEqual(parseCSV(undefined).length, 0);
});

test('parseCSV handles complex real-world example', () => {
  const csv = `"Meeting Notes","Discussed Q4 goals, budget review, and ""action items"" for next week"
"Shopping List","Milk, eggs, bread
Apples, oranges
Cheese, butter"
Simple Note,Simple body without quotes
"Note with, comma","Body with ""quotes"" and, commas"`;
  
  const result = parseCSV(csv);
  
  assert.strictEqual(result.length, 4);
  assert.deepStrictEqual(result[0], {
    title: 'Meeting Notes',
    body: 'Discussed Q4 goals, budget review, and "action items" for next week'
  });
  assert.deepStrictEqual(result[1], {
    title: 'Shopping List',
    body: 'Milk, eggs, bread\nApples, oranges\nCheese, butter'
  });
  assert.deepStrictEqual(result[2], {
    title: 'Simple Note',
    body: 'Simple body without quotes'
  });
  assert.deepStrictEqual(result[3], {
    title: 'Note with, comma',
    body: 'Body with "quotes" and, commas'
  });
});

test('findDuplicates identifies duplicate notes', () => {
  const newNotes = [
    { title: 'Note 1', body: 'Body 1' },
    { title: 'Note 2', body: 'Body 2' },
    { title: 'Note 1', body: 'Body 1' }, // Duplicate
  ];
  
  const existingNotes = [
    { title: 'Note 2', body: 'Body 2' }, // Duplicate
  ];
  
  const result = findDuplicates(newNotes, existingNotes);
  
  assert.strictEqual(result.duplicates.length, 2);
  assert.strictEqual(result.unique.length, 1);
  assert.deepStrictEqual(result.unique[0], { title: 'Note 1', body: 'Body 1' });
});

test('findDuplicates handles no duplicates', () => {
  const newNotes = [
    { title: 'Note 1', body: 'Body 1' },
    { title: 'Note 2', body: 'Body 2' },
  ];
  
  const existingNotes = [
    { title: 'Note 3', body: 'Body 3' },
  ];
  
  const result = findDuplicates(newNotes, existingNotes);
  
  assert.strictEqual(result.duplicates.length, 0);
  assert.strictEqual(result.unique.length, 2);
});

test('findDuplicates handles empty existing notes', () => {
  const newNotes = [
    { title: 'Note 1', body: 'Body 1' },
    { title: 'Note 2', body: 'Body 2' },
  ];
  
  const result = findDuplicates(newNotes, []);
  
  assert.strictEqual(result.duplicates.length, 0);
  assert.strictEqual(result.unique.length, 2);
});

test('findDuplicates detects duplicates within new notes', () => {
  const newNotes = [
    { title: 'Note 1', body: 'Body 1' },
    { title: 'Note 1', body: 'Body 1' }, // Duplicate within new notes
    { title: 'Note 2', body: 'Body 2' },
  ];
  
  const result = findDuplicates(newNotes, []);
  
  assert.strictEqual(result.duplicates.length, 1);
  assert.strictEqual(result.unique.length, 2);
});
