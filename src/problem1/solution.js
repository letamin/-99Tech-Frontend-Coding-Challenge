// # Task

// Provide 3 unique implementations of the following function in JavaScript.

// **Input**: `n` - any integer

// *Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

// **Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15

// 1. Iterative approach
function sum_to_n_iterative(n) {
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
}
console.log(sum_to_n_iterative(5)); // 15

// 2. Mathematical formula
function sum_to_n_formula(n) {
  return (n * (n + 1)) / 2;
}
console.log(sum_to_n_formula(5));   // 15

// 3. Recursive approach
function sum_to_n_recursive(n) {
  if (n <= 1) {
    return n;
  }

  return n + sum_to_n_recursive(n - 1);
}
console.log(sum_to_n_recursive(5)); // 15