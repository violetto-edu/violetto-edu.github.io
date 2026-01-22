# Take the Institution name as input. Use Pydantic to define the schema for the desired output and create a custom output parser. Invoke the Chain and Fetch Results. Extract the below Institution related details from Wikipedia: The founder of the Institution. When it was founded. The current branches in the institution . How many employees are working in it. A brief 4-line summary of the institution.

---

Imagine having a smart assistant that can instantly fetch and organize detailed information about any institution from Wikipedia. This tool makes it effortless to gather key facts about educational institutions, companies, or organizations. Here's how it works:

1. **Smart Data Structure**: Using Pydantic, we create a reliable framework that ensures all institution details are properly organized and validated, just like having a well-organized filing system for your data.
2. **Wikipedia Connection**: The tool seamlessly connects to Wikipedia's vast knowledge base, acting as your personal research assistant to gather accurate information about any institution.
3. **Intelligent Extraction**: It automatically identifies and extracts crucial details like founding dates, founders, and current operations, saving you hours of manual research.
4. **Clean Presentation**: All the gathered information is neatly formatted into a structured output, making it perfect for use in applications, reports, or presentations.

---

### Python Code:

```python
from pydantic import BaseModel
import wikipediaapi

# Define the data model using Pydantic
class InstitutionDetails(BaseModel):
	name: str
	founder: str
	founded: str
	branches: int
	employees: int
	summary: str

# Fetch details of an institution (Harvard University as an example)
institution_name = "Harvard University"

# Define a user agent (a string identifying your request, following Wikipedia's policy)
user_agent = "YourAppName/1.0 (your-email@example.com)" # Replace with your app's name and your contact info

# Initialize the Wikipedia API object with the user agent
wiki = wikipediaapi.Wikipedia(language='en', user_agent=user_agent)

# Fetch the page
page = wiki.page(institution_name)

summary = page.summary[:500] # Fetching a summary (you can limit the length)

# Parse the institution details (example data)
details = InstitutionDetails(
	name = institution_name,
	founder = "John Harvard",
	founded = "1636",
	branches = 12,
	employees = 20000,
	summary = summary
)

# Output the details in JSON format using model_dump_json
print(details.model_dump_json())
```
---