import {visitJsImport} from './visit-js-import';
import {parseJs} from './parse-js';

test('visitJsImport named', () => {
  const path = parseJs(`
    import {a, b} from 'c';
    import d from 'd';
    console.log(a);
    console.log(d);
    function test() {
      return a;
    }
  `);
  const handler = jest.fn((path, refPaths) => {
    expect(refPaths).toHaveLength(2);
  });
  visitJsImport(path, `import {a} from 'c'`, handler);
  expect(handler).toBeCalledTimes(1);
});

test('visitJsImport no references', () => {
  const path = parseJs(`
    import {a, b} from 'c';
  `);
  const handler = jest.fn((path, refPaths) => {
    expect(refPaths).toHaveLength(0);
  });
  visitJsImport(path, `import {a} from 'c'`, handler);
  expect(handler).toBeCalledTimes(1);
});

test('visitJsImport no binding', () => {
  const path = parseJs(`
    import 'c';
  `);
  const handler = jest.fn((path, refPaths) => {
    expect(refPaths).toHaveLength(0);
  });
  visitJsImport(path, `import {a} from 'c'`, handler);
  expect(handler).toBeCalledTimes(0);
});

test('visitJsImport namespace', () => {
  const path = parseJs(`
    import * as a from 'c';
    import d from 'd';
    console.log(a);
    console.log(d);
    function test() {
      return a;
    }
  `);
  const handler = jest.fn((path, refPaths) => {
    expect(refPaths).toHaveLength(2);
  });
  visitJsImport(path, `import * as b from 'c'`, handler);
  expect(handler).toBeCalledTimes(1);
});

test('visitJsImport default', () => {
  const path = parseJs(`
    import a from 'c';
    import d from 'd';
    console.log(a);
    console.log(d);
    function test() {
      return a;
    }
  `);
  const handler = jest.fn((path, refPaths) => {
    expect(refPaths).toHaveLength(2);
  });
  visitJsImport(path, `import b from 'c'`, handler);
  expect(handler).toBeCalledTimes(1);
});

test('visitJsImport validation', () => {
  const path = parseJs(`
    import a from 'c';
  `);
  const handler = jest.fn();
  expect(() => {
    visitJsImport(path, `const test = 'test'`, handler);
  }).toThrow();
  expect(() => {
    visitJsImport(path, `import {a, b} from 'c'`, handler);
  }).toThrow();
  expect(handler).not.toBeCalled();
});
