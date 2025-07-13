# Contributing to Irsal

Thank you for your interest in contributing to Irsal! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/abodsakah/Irsal
   cd Irsal
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Workflow

### Running the App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Code Style

- **TypeScript**: We use TypeScript for type safety
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled automatically
- **Tailwind CSS**: Use utility-first CSS classes

### Testing Your Changes

1. Test the app in all supported languages (English, Swedish, Arabic)
2. Verify SMS functionality with valid Twilio credentials
3. Test AI translation with valid DeepSeek API key
4. Ensure the app builds successfully

## 📝 What Can You Contribute?

### 🐛 Bug Reports

When reporting bugs, please include:
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Console errors** from developer tools
- **System information** (OS, Node.js version)

### ✨ Feature Requests

- Check existing issues to avoid duplicates
- Clearly describe the feature and its benefits
- Consider how it fits with the app's purpose

### 🔧 Code Contributions

We welcome contributions for:
- **Bug fixes**
- **New features** (discuss first in an issue)
- **Performance improvements**
- **Documentation updates**
- **Translations** for new languages
- **UI/UX improvements**

## 🌍 Internationalization

Adding a new language:

1. **Create translation file**: `src/i18n/locales/[language-code].json`
2. **Follow existing structure** from `en.json`
3. **Add language to configuration**: Update `src/i18n/i18n.ts`
4. **Test thoroughly** with RTL languages if applicable

## 📋 Pull Request Process

1. **Update documentation** if needed
2. **Add translations** for any new text
3. **Test your changes** thoroughly
4. **Write clear commit messages**:
   ```
   feat: add member export functionality
   fix: resolve translation loading issue
   docs: update installation instructions
   ```
5. **Create detailed PR description**:
   - What changes were made
   - Why the changes were needed
   - How to test the changes

## 🔐 Security Considerations

- **Never commit API keys** or sensitive credentials
- **Follow secure coding practices**
- **Report security vulnerabilities** privately

## 📞 Questions?

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion

## 📜 License

By contributing to Irsal, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Irsal better for community organizations worldwide! 🙏
