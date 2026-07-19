# 🤝 Contributing to Northstar

First off, thank you for considering contributing to Northstar! As an open-source initiative targeting the FIFA World Cup 2026 Smart Stadium challenge, we welcome contributions from developers, designers, data scientists, and AI enthusiasts.

This document outlines the process for contributing to the repository.

---

## 📋 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We expect all contributors to maintain a respectful, inclusive, and professional environment. Harassment or abusive behavior will not be tolerated.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs

If you find a bug, please open an Issue on GitHub. Include:
- A clear, descriptive title.
- Steps to reproduce the bug.
- Expected behavior vs. actual behavior.
- System information (OS, Browser, Node version).
- Screenshots if applicable.

### 2. Suggesting Enhancements

We love new ideas! If you have a feature request related to stadium operations, crowd management, or AI, open a Feature Request Issue. Explain:
- The problem your feature solves.
- How it aligns with the FIFA Smart Stadium problem statement.
- Proposed implementation details.

### 3. Submitting Pull Requests

Ready to write some code? Follow these steps:

1. **Fork the Repository:** Create your own fork of `AbhineetS/northstar`.
2. **Create a Branch:** Branch off from `main`. Use a descriptive naming convention:
   - `feature/add-new-ai-copilot`
   - `fix/map-rendering-bug`
   - `docs/update-architecture`
3. **Commit Your Changes:** Write clear, concise commit messages.
   - Good: `feat(map): add accessible routes to stadium overlay`
   - Bad: `fixed stuff`
4. **Push to Your Fork:** Push your branch to your GitHub fork.
5. **Open a Pull Request (PR):** Submit a PR against the `main` branch of the upstream repository.

---

## 🧑‍💻 Engineering Standards

To maintain a **Code Quality score of 100**, all PRs must adhere to the following strict standards:

### Type Safety
- **No `any` types:** All variables, function parameters, and return types must be explicitly typed using TypeScript interfaces or types.
- Ensure strict null checking.

### Testing
- **100% Test Coverage Requirement:** Any new component, hook, or service MUST include corresponding unit tests using Vitest and React Testing Library.
- PRs that drop overall test coverage below 100% will not be merged.
- Test for empty states, loading states, error boundaries, and accessibility parameters.

### Accessibility (a11y)
- All UI changes must adhere to **WCAG 2.2 AA** standards.
- Include appropriate `aria-labels`, maintain semantic HTML, and ensure full keyboard navigability.
- Do not rely solely on color to convey information.

### Linting & Formatting
Before submitting your PR, run the validation suite locally:
```bash
npm run lint         # Must pass with 0 warnings
npx tsc --noEmit     # Must pass with 0 errors
npx vitest run       # All tests must pass
```

---

## 🏗️ Architecture Guidelines

- **Separation of Concerns:** Keep business logic inside custom hooks or Zustand stores. Keep UI components purely presentational where possible.
- **AI Prompts:** When modifying the Gemini GenAI prompts in `GeminiAIService.ts`, ensure instructions explicitly demand JSON structures to prevent parsing failures in the UI.
- **Component Styling:** Use the predefined Tailwind CSS tokens in `globals.css`. Do not introduce hardcoded hex colors unless absolutely necessary for external branding.

---

## ❓ Need Help?

If you need help getting started or have questions about the architecture, please open a Discussion on GitHub or tag the maintainers in your PR. 

*Let's build the future of stadium operations together!*
