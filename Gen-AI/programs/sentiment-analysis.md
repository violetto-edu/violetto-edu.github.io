# Use a pre-trained Hugging Face model to analyze sentiment in text. Assume a real-world application, Load the sentiment analysis pipeline. Analyze the sentiment by giving sentences to input.

---

### What is Sentiment Analysis?

Sentiment analysis is the process of determining whether a piece of text expresses a positive, negative, or neutral sentiment. It's widely used in analyzing customer feedback, reviews, and social media to understand public opinion.

Lets use the **Hugging Face Transformers** library to analyze customer feedback. Here’s how it works:

1. **Importing the Model**: Lets initialize a sentiment analysis model using `pipeline("sentiment-analysis")`. This model is pre-trained and can identify the sentiment of a given text.
2. **Analyzing Feedback**: Processes a list of customer feedback comments. For each comment, the model predicts if the sentiment is "POSITIVE" or "NEGATIVE" along with a confidence score (how sure the model is about its prediction).
3. **Displaying Results**: Finally, the script will print the original feedback, the predicted sentiment, and the confidence score, allowing us to see how customers feel about your service or product.

---
### Python Code:

```python
from transformers import pipeline

# Load the pre-trained sentiment analysis pipeline
sentiment_analyzer = pipeline("sentiment-analysis")

customer_feedback = [
        "The product is amazing! I love it!",
        "Terrible service, I am very disappointed.",
        "This is a great experience, I will buy again.",
        "Worst purchase I’ve ever made. Completely dissatisfied.",
        "I'm happy with the quality, but the delivery was delayed."
    ]

for feedback in customer_feedback:
        sentiment_result = sentiment_analyzer(feedback)
        sentiment_label = sentiment_result[0]['label']
        sentiment_score = sentiment_result[0]['score']
        
        # Display sentiment results
        print(f"Feedback: {feedback}")
        print(f"Sentiment: {sentiment_label} (Confidence: {sentiment_score:.2f})\n")

```
---