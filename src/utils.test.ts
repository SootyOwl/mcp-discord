import { describe, expect, it } from 'vitest';
import { preserveBigIntegers } from './utils.js';

describe('preserveBigIntegers', () => {
  it('quotes bare snowflake IDs after colons', () => {
    const input = '{"channelId": 1475843393870364755}';
    const result = preserveBigIntegers(input);
    expect(result).toBe('{"channelId": "1475843393870364755"}');
  });

  it('quotes multiple snowflake IDs in one object', () => {
    const input = '{"channelId": 1475843393870364755, "messageId": 1234567890123456789}';
    const result = preserveBigIntegers(input);
    expect(result).toBe('{"channelId": "1475843393870364755", "messageId": "1234567890123456789"}');
  });

  it('does not modify numbers already quoted as strings', () => {
    const input = '{"channelId": "1475843393870364755"}';
    const result = preserveBigIntegers(input);
    expect(result).toBe(input);
  });

  it('does not modify small safe integers', () => {
    const input = '{"limit": 25, "offset": 0}';
    const result = preserveBigIntegers(input);
    expect(result).toBe(input);
  });

  it('does not modify 15-digit numbers (below threshold)', () => {
    const input = '{"id": 123456789012345}';
    const result = preserveBigIntegers(input);
    expect(result).toBe(input);
  });

  it('quotes 16-digit numbers (at threshold)', () => {
    const input = '{"id": 1234567890123456}';
    const result = preserveBigIntegers(input);
    expect(result).toBe('{"id": "1234567890123456"}');
  });

  it('handles snowflakes in arrays', () => {
    const input = '{"ids": [1475843393870364755, 1475843393870364756]}';
    const result = preserveBigIntegers(input);
    expect(result).toBe('{"ids": ["1475843393870364755", "1475843393870364756"]}');
  });

  it('preserves the result through JSON.parse roundtrip', () => {
    const input = '{"channelId": 1475843393870364755, "message": "hello"}';
    const processed = preserveBigIntegers(input);
    const parsed = JSON.parse(processed);
    expect(parsed.channelId).toBe('1475843393870364755');
    expect(parsed.message).toBe('hello');
  });

  it('does not corrupt snowflakes inside string values', () => {
    const input = '{"content": "ID is 1475843393870364755 here"}';
    const result = preserveBigIntegers(input);
    // The number inside a string value should not be double-quoted
    expect(result).toBe(input);
  });

  it('handles mixed safe and unsafe integers', () => {
    const input = '{"channelId": 1475843393870364755, "limit": 10}';
    const result = preserveBigIntegers(input);
    const parsed = JSON.parse(result);
    expect(parsed.channelId).toBe('1475843393870364755');
    expect(parsed.limit).toBe(10);
  });

  it('handles nested objects with snowflakes', () => {
    const input = '{"data": {"channelId": 1475843393870364755}}';
    const result = preserveBigIntegers(input);
    // The colon before the snowflake should trigger quoting
    expect(JSON.parse(result).data.channelId).toBe('1475843393870364755');
  });

  it('passes through empty objects unchanged', () => {
    expect(preserveBigIntegers('{}')).toBe('{}');
  });

  it('passes through strings without numbers unchanged', () => {
    const input = '{"message": "hello world"}';
    expect(preserveBigIntegers(input)).toBe(input);
  });
});
