"""How sure an accuracy figure is: exact binomial bounds and the sample size a claim needs."""
from __future__ import annotations

import math


def _binom_cdf(k: int, n: int, p: float) -> float:
    """P(X ≤ k) for X ~ Binomial(n, p), summed in log space so large n stays exact enough."""
    if p <= 0.0:
        return 1.0
    if p >= 1.0:
        return 1.0 if k >= n else 0.0
    lp, lq = math.log(p), math.log1p(-p)
    total = 0.0
    for i in range(k + 1):
        total += math.exp(math.lgamma(n + 1) - math.lgamma(i + 1) - math.lgamma(n - i + 1) + i * lp + (n - i) * lq)
    return min(total, 1.0)


def lower_bound(correct: int, n: int, confidence: float = 0.95) -> float:
    """One-sided Clopper–Pearson lower bound on the true accuracy after `correct` successes in `n` trials:
    the accuracy we can claim at this confidence. 300 out of 300 gives 0.990."""
    if n == 0:
        return 0.0
    if correct == 0:
        return 0.0
    alpha = 1.0 - confidence
    lo, hi = 0.0, 1.0
    for _ in range(60):                 # bisection: largest p with P(X ≥ correct | p) ≤ alpha
        mid = (lo + hi) / 2.0
        tail = 1.0 - _binom_cdf(correct - 1, n, mid)
        if tail > alpha:
            hi = mid
        else:
            lo = mid
    return lo


def needed_for(target: float, confidence: float = 0.95, failures: int = 0) -> int:
    """Smallest n such that n − failures correct out of n proves accuracy ≥ target at this confidence."""
    n = failures + 1
    while lower_bound(n - failures, n, confidence) < target:
        n = n + max(1, n // 50)
        if n > 1_000_000:
            raise ValueError("target not reachable")
    while n > failures + 1 and lower_bound(n - 1 - failures, n - 1, confidence) >= target:
        n -= 1
    return n
