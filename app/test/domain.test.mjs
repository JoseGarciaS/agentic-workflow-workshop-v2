import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { add, isEven } from '../src/domain.mjs';

describe('add', () => {
  it('adds two numbers', () => {
    assert.equal(add(2, 3), 5);
  });

  it('handles negative numbers', () => {
    assert.equal(add(-1, 1), 0);
  });
});

describe('isEven', () => {
  it('returns true for even numbers', () => {
    assert.equal(isEven(4), true);
  });

  it('returns false for odd numbers', () => {
    assert.equal(isEven(3), false);
  });
});
