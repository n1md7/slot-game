export function Calculator(reels) {
  this.patterns = new Patterns();
}

function Patterns() {
  this.patterns = [
    [1, 1],
    [0, 0],
  ];
}
