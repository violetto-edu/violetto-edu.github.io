# Install LangChain, Cohere (for key), LangChain-community. Get the API key( By logging into Cohere and obtaining the Cohere key). Load a text document from your Google Drive . Create a prompt template to display the output in a particular manner.

---

### What is Document Q&A with LangChain?

Document Q&A with LangChain is a powerful way to analyze and extract information from text documents using AI. This implementation uses Cohere's language model to process and summarize document content. Here's how it works:

1. **Document Loading**: The code loads a text document from your local file system, making it available for processing.
2. **Prompt Engineering**: A custom prompt template is created to guide the AI in how to analyze and present the information.
3. **AI Processing**: Using Cohere's language model, the document is processed and analyzed according to the prompt template.
4. **Output Generation**: The AI generates a structured response based on the document content and prompt instructions.

> Get the text file [here](https://violetto-edu.github.io/Gen-AI/public/resources/8prg.txt).

---

### Python Code:

```python
from langchain_community.llms import Cohere # Import from the correct package
from langchain.prompts import PromptTemplate
import os

# Set up the Cohere API key
COHERE_API_KEY = "your-key-here"
os.environ["COHERE_API_KEY"] = COHERE_API_KEY

# Load a text document from your file system
file_path = "8prg.txt"

try:
	with open(file_path, "r") as file:
		document_text = file.read()
except FileNotFoundError:
	print(f"File not found: {file_path}")
	exit()

# Define a prompt template
template = """
You are an assistant tasked with analyzing text.
Given the following document: {document} Provide a summary in three concise bullet points:
"""
prompt = PromptTemplate(
	input_variables=["document"],
	template=template,
	)

# Initialize the Cohere model
llm = Cohere()

# Format the prompt and get the output
formatted_prompt = prompt.format(document=document_text)

# Using the 'invoke()' method to generate the output instead of '__call_'
response = llm.invoke(formatted_prompt)

# Display the output
print("Response:")
print(response)
```

---
