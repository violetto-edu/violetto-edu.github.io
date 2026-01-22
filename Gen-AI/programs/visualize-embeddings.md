# Use dimensionality reduction (e.g., PCA or t-SNE) to visualize word embeddings for Q1. Select 10 words from a specific domain (e.g., sports, technology) and visualize their embeddings. Analyze clusters and relationships. Generate contextually rich outputs using embeddings. Write a program to generate 5 semantically similar words for a given input.

---

### What is Principal Component Analysis?

Principal Component Analysis (PCA) is a technique used for dimensionality reduction in machine learning. It simplifies a large dataset by transforming it into a smaller set of variables while preserving essential patterns and trends.

The function `numpy.random.seed` in the NumPy library initializes the seed for random number generation. For example, using a seed value like 42 ensures that the results of random number generation can be reproduced.

Here’s a quick example:

```python
import numpy as np  # Code A
np.random.seed(0)   # Code B
s = np.random.choice(5, 10)  # Code C
print(s)  # Code D
```

This code generates ten random numbers from the range 0 to 4.

When applying PCA, the number of principal components, typically set to 2 for better visualization, should be chosen based on the specific data's characteristics.

Additionally, `numpy.random.rand()` generates an array of the specified shape, filled with random values uniformly distributed between 0 and 1, making it useful for simulations and machine learning tasks.

---
### Python Code:

```python
import matplotlib
'''
Note: Remove or comment out below line if you are running in an environment that operates headless
(e.g., a Jupyter Notebook-like interface without a graphical user interface [GUI], such as Google Colab)
'''
matplotlib.use('TkAgg') # Switch backend to TkAgg

from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import numpy as np

# Sample domain words
words = ['football', 'basketball', 'cricket', 'technology', 'computer', 'robot', 'AI', 'cloud', 'python', 'data']

# Simulate word vectors (replace this with your actual word embeddings)
np.random.seed(42) # For reproducibility
word_vectors = {word: np.random.rand(100) for word in words} # Each word has a 100-dimensional vector

# Perform PCA
pca = PCA(n_components=2)
pca_result = pca.fit_transform([word_vectors[word] for word in words])

# Plot the results
plt.figure(figsize=(8, 8))
plt.scatter(pca_result[:, 0], pca_result[:, 1])

# Annotate points
for i, word in enumerate(words):
	plt.annotate(word, (pca_result[i, 0], pca_result[i, 1]))
	
plt.title('Word Embedding Visualization with PCA')
plt.show()
```
---