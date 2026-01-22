# Build a chatbot for the Indian Penal Code. We'll start by downloading the official Indian Penal Code document, and then we'll create a chatbot that can interact with it. Users will be able to ask questions about the Indian Penal Code and have a conversation with it.

---

Imagine having a virtual assistant to help you navigate the Indian Penal Code (IPC) effortlessly. This chatbot interacts with an IPC PDF document, making legal information easily accessible. Here’s how it works:

1. **Extracting Text**: The **fitz** library reads the IPC document, using the `extract` function to pull text from every page. You’ll have all the essential information right at your fingertips.
2. **Searching Sections**: Need to find a specific section? The `search` function scans the extracted text for your queries in a case-insensitive way, ensuring you get relevant results without worrying about case sensitivity.
3. **Chatbot Interface**: Engage with the `chatbot` function to ask questions about the IPC. It provides relevant text directly from the document, making it easy to find information without sifting through pages of legal jargon.

> Get the IPC PDF document [here](https://drive.google.com/file/d/1e09QDtNREkvcDg3YFR74h7tyZmGMoo7n/view?usp=drivesdk).

---
### Python Code:

```python
import fitz # PyMuPDF

# Step 1: Extract Text from IPC PDF using PyMuPDF
def extract(file):  
	text = ""  
	with fitz.open(file) as pdf:  
		for page in pdf:  
			text += page.get_text() # Extract text from each page  
	return text

# Step 2: Search for Relevant Sections in IPC
def search(query, ipc):  
	query = query.lower()  
	lines = ipc.split("\n")  
	results = [line for line in lines if query in line.lower()]  
	return results if results else ["No relevant section found."]

# Step 3: Main Chatbot Function
def chatbot():  
	print("Loading IPC document...")  
	ipc = extract("IPC.pdf")  
	while True:  
		query = input("Ask a question about the IPC (type 'exit' to quit): ")  
		if query.lower() == "exit":  
			print("Goodbye!")  
			break
	    results = search(query, ipc)  
	    print("\n".join(results))  
	    print("-" * 50)  

# Start the chatbot
chatbot()
```
---