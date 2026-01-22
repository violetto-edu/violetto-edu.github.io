# Use word embeddings to create meaningful sentences for creative tasks. Retrieve similar words for a seed word. Create a sentence or story using these words as a starting point. Write a program that: Takes a seed word. Generates similar words. Constructs a short paragraph using these words.

---

Word embeddings, such as GloVe (Global Vectors for Word Representation), represent words as vectors based on their contextual relationships. This allows for the identification of semantically similar words, facilitating creative tasks like sentence generation.

### Generating Similar Words

The program begins with a **seed word** (e.g., "hacking") and retrieves the top 5 similar words using GloVe. This process identifies words that share relevant meanings and contexts.

### Constructing Meaningful Sentences

The **create_paragraph** function constructs a paragraph by:
1. **Combining Words**: Integrating the seed word with its similar words into a coherent sentence structure.
2. **Introducing Variation**: Shuffling the similar words to create diverse outputs while maintaining contextual relevance.
3. **Formulating a Paragraph**: Concatenating the seed and similar words into a readable and engaging description.

---
### Python Code:

```python
from gensim.downloader import load
import random

# Load the pre-trained GloVe model
glove_model = load("glove-wiki-gigaword-50")

# Function to construct a meaningful paragraph
def create_paragraph(topic_word, similar_words):  
  paragraph = f"The topic of {topic_word} is fascinating, often linked to terms like"
  random.shuffle(similar_words) # Shuffle to add variety

  for word in similar_words:
    paragraph += str(word) + ", "
    
  paragraph = paragraph.rstrip(", ") + "."
  return paragraph

topic_word = "hacking"  
similar_words_with_scores = glove_model.most_similar(topic_word, topn=5)  
similar_words = [word for word, similarity_score in similar_words_with_scores]  
paragraph = create_paragraph(topic_word, similar_words)
print(paragraph)
```
---