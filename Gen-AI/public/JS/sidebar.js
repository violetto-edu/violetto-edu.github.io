import { loadProgram, updateActiveLink } from "./utils.js";

// List of program markdown files
const programs = [
  {
    name: "Getting Started",
    file: "getting-started.md",
  },
  { name: "1. Word Vector Exploration", file: "word-vectors.md" },
  { name: "2. Visualizing Word Embeddings", file: "visualize-embeddings.md" },
  { name: "3. Custom Word2Vec Model", file: "custom-word2vec.md" },
  { name: "4. Enhancing AI Prompts", file: "enhance-ai-prompts.md" },
  {
    name: "5. Creative Writing with Embeddings",
    file: "creative-writing-embeddings.md",
  },
  {
    name: "6. Sentiment Analysis with Hugging Face",
    file: "sentiment-analysis.md",
  },
  { name: "7. Text Summarization", file: "text-summarization.md" },
  { name: "8. Document Q&A with LangChain", file: "document-qa-langchain.md" },
  {
    name: "9. Institution Info Extraction",
    file: "institution-info-extraction.md",
  },
  { name: "10. Indian Penal Code Chatbot", file: "ipc-chatbot.md" },
];

export function populateSidebar() {
  const programList = document.getElementById("program-list");
  programList.innerHTML = "";
  programList.classList.add("program-list");
  programs.forEach((program) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${program.file}`;
    a.innerHTML = `${program.name}`;
    a.onclick = (e) => {
      e.preventDefault();
      loadProgram(program.file);
      updateActiveLink(a);
    };
    li.appendChild(a);
    programList.appendChild(li);
  });
  sidebarLinkListeners();
}

function sidebarLinkListeners() {
  const programLinks = document.querySelectorAll("#program-list a");
  const sidebar = document.getElementById("sidebar");

  if (programLinks) {
    programLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
          toggleSidebar();
        }
      });
    });
  }
}

export function loadProgramsFromHash() {
  const hash = window.location.hash.slice(1);
  const program = programs.find((t) => t.file === hash);
  if (program) {
    loadProgram(program.file);
    updateActiveLink(
      document.querySelector(`#program-list a[href="#${program.file}"]`)
    );
  } else {
    loadProgram(programs[0].file);
    updateActiveLink(document.querySelector("#program-list a"));
  }
}

// Export programs for use in other modules
export { programs };
