# Eastwood's ARC Principle — Research Toolkit

**Test the equation yourself. Verify the data. Challenge the findings.**

This toolkit provides everything you need to replicate and extend the analysis from:

> **"Eastwood's ARC Principle: Preliminary Evidence for Super-Linear Capability Amplification Through Sequential Self-Reference"**
>
> Michael Darius Eastwood, January 2026

---

## The Equation

```
U = I × R^α
```

Where:
- **U** = Effective capability (measurable output)
- **I** = Base intelligence (single-pass processing capacity)
- **R** = Recursive depth (self-referential iterations)
- **α** = Scaling exponent (measured ≈ 1.3 for sequential reasoning; theoretical limit = 2)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/VerdictUK/infinite-architects-website.git
cd infinite-architects-website/arc-research-toolkit
```

### 2. Install Dependencies

```bash
pip install numpy scipy matplotlib pandas seaborn
```

### 3. Run the Analysis

```bash
python arc_principle_research_toolkit.py
```

This will:
- Calculate scaling exponents for OpenAI o1 and DeepSeek-R1
- Run sensitivity analysis across token ratio assumptions
- Generate publication-quality visualisations
- Export results to JSON

---

## What's Included

| File | Description |
|------|-------------|
| `arc_principle_research_toolkit.py` | Complete Python implementation (~800 lines) |
| `arc_principle_results.json` | Pre-computed results for verification |
| `arc_scaling_comparison.png` | Parallel vs Sequential recursion comparison |
| `arc_sensitivity_analysis.png` | α sensitivity to token ratio assumptions |
| `arc_falsification_regions.png` | Falsification criteria visualisation |

---

## Key Functions

### Calculate α from Two Points
```python
from arc_principle_research_toolkit import calculate_alpha_two_points

alpha = calculate_alpha_two_points(
    R1=12000,   # Recursive depth point 1
    R2=23000,   # Recursive depth point 2
    E1=0.30,    # Error rate at point 1 (30%)
    E2=0.125    # Error rate at point 2 (12.5%)
)
print(f"α = {alpha:.3f}")  # α ≈ 1.35
```

### Run Full Analysis
```python
from arc_principle_research_toolkit import run_complete_analysis

results = run_complete_analysis(verbose=True)
```

### Sensitivity Analysis
```python
from arc_principle_research_toolkit import sensitivity_analysis_token_ratio

sensitivity = sensitivity_analysis_token_ratio(
    base_accuracy_1=70.0,      # Lower accuracy
    base_accuracy_2=87.5,      # Higher accuracy
    base_tokens_1=12000,       # Known token count
    token_ratio_range=(1.2, 3.0)  # Range to test
)
```

---

## Data Sources

All data is sourced from published technical reports:

| Source | Data Used | Citation |
|--------|-----------|----------|
| **OpenAI o1** | AIME 2024 accuracy at 1, 64, 1000 samples | [Learning to Reason with LLMs](https://openai.com/index/learning-to-reason-with-llms) (Sept 2024) |
| **DeepSeek-R1** | AIME 2024 accuracy at ~12K and ~23K tokens | [arXiv:2501.12948](https://arxiv.org/abs/2501.12948) (Jan 2025) |

**Important caveat:** The 23,000 token count for DeepSeek-R1-0528 is **estimated** based on "enhanced thinking depth" descriptions. The sensitivity analysis shows how α varies with this assumption.

---

## Falsification Criteria

The ARC Principle makes falsifiable predictions:

| α Range | Interpretation | Status |
|---------|----------------|--------|
| α < 1.0 | Sub-linear (diminishing returns) | FALSIFIED for that recursion type |
| 1.0 ≤ α < 1.5 | Super-linear but weak | PARTIAL support |
| 1.5 ≤ α < 1.7 | Super-linear approaching quadratic | WEAK support |
| **1.7 ≤ α ≤ 2.3** | **Quadratic confirmed** | **SUPPORTED** |
| 2.3 < α ≤ 2.5 | Super-quadratic but within tolerance | WEAK support |
| α > 2.5 | Exponential regime | FALSIFIED (different relationship) |

### Current Findings

- **Parallel recursion (OpenAI o1):** α ≈ 0.1–0.3 → **FALSIFIED** (sub-linear)
- **Sequential recursion (DeepSeek-R1):** α ≈ 1.3 → **PARTIAL support** (super-linear but not yet quadratic)

---

## Extend the Research

### Add Your Own Data

```python
from arc_principle_research_toolkit import DataPoint, calculate_alpha_power_law_fit

# Add data from a new model
my_data = [
    DataPoint(R=5000, accuracy=65.0, error_rate=0.35, source="My Model v1"),
    DataPoint(R=15000, accuracy=82.0, error_rate=0.18, source="My Model v2"),
]

result = calculate_alpha_power_law_fit(my_data)
print(f"α = {result.alpha:.3f}")
print(f"Status: {result.falsification_status}")
```

### Test Different Benchmarks

The framework applies to any capability metric. Test with:
- MATH benchmark
- HumanEval (code generation)
- GSM8K (arithmetic reasoning)
- Custom evaluations

---

## Contribute

Found new data? Run replication studies? Challenge the findings?

1. Fork this repository
2. Add your analysis to `arc_principle_research_toolkit.py`
3. Submit a pull request with your findings

**All contributions welcome — including falsifications.**

---

## Citation

If you use this toolkit in research:

```bibtex
@misc{eastwood2026arc,
  author = {Eastwood, Michael Darius},
  title = {Eastwood's ARC Principle: Preliminary Evidence for Super-Linear Capability Amplification Through Sequential Self-Reference},
  year = {2026},
  publisher = {Infinite Architects},
  url = {https://infinitearchitects.co.uk}
}
```

---

## Licence

MIT Licence — Free to use, modify, and distribute with attribution.

---

**Questions?** Read the full paper: [Eastwood's ARC Principle (PDF)](../Eastwoods_ARC_Principle.pdf)
