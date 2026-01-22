# Summarize long texts using a pre-trained summarization model using Hugging face model. Load the summarization pipeline. Take a passage as input and obtain the summarized text.

---

### What is Text Summarization?

Text summarization is the process of reducing a longer piece of text to its essential points, making it easier to understand and digest. It’s useful for quickly grasping the main ideas without reading everything.

Lets again use the **Hugging Face Transformers** library to summarize a passage effectively. Here’s how it works:

1. **Importing the Summarization Model**: We will initialize a summarization model using `pipeline("summarization")`. This model is pre-trained to understand and condense text.
2. **The `summarize_text` Function**: This function will take a long passage of text as input and will generate a brief summary. It uses parameters like `max_length` and `min_length` to control how long or short the summary will be, ensuring it captures the main ideas succinctly.
3. **Processing the Input**: For a detailed passage (e.g., about natural language processing), the summarizer extracts the key points and presents them in a shorter format.
4. **Displaying Results**: Finally, the original text and its summary are printed side by side for easy comparison.

---
### Python Code:

```python
from transformers import pipeline

# Load the pre-trained summarization pipeline
summarizer = pipeline("summarization")

# Function to summarize a given passage
def summarize_text(text):
    # Summarizing the text using the pipeline
    summary = summarizer(text, max_length=150, min_length=50, do_sample=False)
    return summary[0]['summary_text']

text = """
Natural language processing (NLP) is a field of artificial intelligence that focuses on the interaction between computers and humans through natural language. 
The ultimate goal of NLP is to enable computers to understand, interpret, and generate human language in a way that is valuable. 
NLP techniques are used in many applications, such as speech recognition, sentiment analysis, machine translation, and chatbot functionality. 
Machine learning algorithms play a significant role in NLP, as they help computers to learn from vast amounts of language data and improve their ability to process and generate text. 
However, NLP still faces many challenges, such as handling ambiguity, understanding context, and processing complex linguistic structures. 
Advances in NLP have been driven by deep learning models, such as transformers, which have significantly improved the performance of many NLP tasks.
"""

# Get the summarized text
summarized_text = summarize_text(text)

# Display the summarized text
print("Original Text:\n", text)
print("\nSummarized Text:\n", summarized_text)
```
---