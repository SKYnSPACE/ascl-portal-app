// main.ts
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment      <-- Necessary for my ESLint setup
  // @ts-ignore: Unreachable code error                              <-- BigInt does not have `toJSON` method
  BigInt.prototype.toJSON = function (): string {
    return this.toString();
  };