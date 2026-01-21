# Contributing to Aletheia

Thank you for your interest in contributing to Aletheia! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct:

- Be respectful and inclusive
- Welcome different perspectives and experiences
- Focus on constructive criticism
- Avoid harassment, discrimination, and offensive language
- Report violations to the maintainers

## Getting Started

### Prerequisites

- Node.js 18.17+
- pnpm 10.6+
- Git

### Setup Development Environment

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/aletheia.git
cd aletheia

# 3. Add upstream remote
git remote add upstream https://github.com/Ns81000/aletheia.git

# 4. Install dependencies
pnpm install

# 5. Create a feature branch
git checkout -b feature/your-feature-name

# 6. Start development server
pnpm dev
```

## Development Workflow

### Before Starting Work

1. Check [existing issues](https://github.com/Ns81000/aletheia/issues) and [pull requests](https://github.com/Ns81000/aletheia/pulls)
2. Open an issue to discuss major changes before starting work
3. Assign yourself to avoid duplicate work

### During Development

```bash
# Keep your branch up to date
git fetch upstream
git rebase upstream/main

# Run these frequently
pnpm type-check    # TypeScript type checking
pnpm lint          # ESLint
pnpm format        # Prettier formatting
pnpm build         # Test production build

# Make commits regularly
git commit -m "type: description"
```

### Testing Locally

```bash
# Development mode
pnpm dev            # Visit http://localhost:3000

# Production build
pnpm build
pnpm start          # Simulate production environment
```

## Commit Messages

Use clear, descriptive commit messages following this format:

```
type(scope): description

[optional body]

[optional footer]
```

### Commit Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature/fix changes
- `perf`: Performance improvements
- `test`: Test additions or changes
- `chore`: Build process, dependencies, or tooling changes
- `ci`: CI/CD configuration changes

### Examples

```
feat(certificate): add EV certificate detection

fix(api): resolve CT logs parsing error

docs: update installation instructions

refactor(components): simplify SecurityGrade component

perf(search): optimize domain validation regex
```

## Pull Requests

### Before Opening a PR

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test thoroughly**
   ```bash
   pnpm type-check
   pnpm lint
   pnpm format
   pnpm build
   ```

3. **Update documentation** if needed

### PR Title and Description

**Title Format:**
```
[type]: Brief description
```

**Description Template:**
```markdown
## Description
Brief explanation of changes

## Related Issue
Fixes #(issue number) or relates to #(issue number)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Bullet point 1
- Bullet point 2

## Testing
- [ ] Tested locally
- [ ] No new warnings
- [ ] TypeScript passes
- [ ] Linting passes

## Screenshots (if applicable)
[Add relevant screenshots]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. At least one maintainer will review the PR
2. Address requested changes promptly
3. Re-request review after making changes
4. PR will be merged once approved

## Coding Standards

### TypeScript

```typescript
// ✅ Good: Explicit types
interface Certificate {
  domain: string;
  expiresAt: Date;
  isValid: boolean;
}

function analyzeCertificate(cert: Certificate): SecurityScore {
  // Implementation
}

// ❌ Bad: Implicit 'any' type
function analyzeCertificate(cert: any): any {
  // Implementation
}
```

### React Components

```typescript
// ✅ Good: Typed component
interface SearchBoxProps {
  onSearch: (domain: string) => void;
  isLoading?: boolean;
}

export default function SearchBox({ onSearch, isLoading }: SearchBoxProps) {
  return (
    // JSX
  );
}

// ✅ Good: Use functional components
// ❌ Avoid: Class components

// ✅ Good: Memoize expensive components
export default memo(SearchBox);
```

### Styling with Tailwind

```typescript
// ✅ Good: Organized classes
<div className="rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-950">
  Content
</div>

// ❌ Bad: Unorganized classes
<div className="py-2 border px-4 bg-white dark:bg-gray-950 rounded-lg border-gray-200 dark:border-gray-800">
  Content
</div>
```

### Files and Naming

- **Components**: PascalCase (e.g., `SearchBox.tsx`)
- **Utilities**: camelCase (e.g., `dateFormatter.ts`)
- **Types**: PascalCase with .ts extension (e.g., `Certificate.ts`)
- **Constants**: UPPER_SNAKE_CASE

### Code Organization

```
component/
├── Component.tsx         # Main component
├── Component.test.tsx    # Tests (if applicable)
└── types.ts             # Type definitions
```

## Testing

### Test Guidelines

- Write tests for new features
- Ensure existing tests pass
- Aim for meaningful test coverage
- Test edge cases and error scenarios

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Generate coverage report
pnpm test --coverage
```

### Test Example

```typescript
import { render, screen } from '@testing-library/react';
import SearchBox from './SearchBox';

describe('SearchBox', () => {
  it('should render search input', () => {
    render(<SearchBox onSearch={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should call onSearch with domain on submit', () => {
    const onSearch = jest.fn();
    render(<SearchBox onSearch={onSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'example.com' } });
    fireEvent.submit(input.form!);
    
    expect(onSearch).toHaveBeenCalledWith('example.com');
  });
});
```

## Documentation

### Update README

If your changes affect users, update relevant sections:
- Feature descriptions
- API documentation
- Configuration options
- Known limitations

### Code Comments

```typescript
// ✅ Good: Explain why, not what
// Use a more efficient algorithm for large datasets
const optimizedResults = data.sort(compareFn);

// ❌ Bad: Obvious comment
// Sort the data
data.sort(compareFn);
```

### JSDoc Comments

```typescript
/**
 * Validates if a certificate is currently valid
 * @param certificate - The certificate to validate
 * @returns true if certificate is valid and not expired
 * @throws Error if certificate parsing fails
 */
export function isValidCertificate(certificate: Certificate): boolean {
  // Implementation
}
```

## Questions?

- **Issues**: [GitHub Issues](https://github.com/Ns81000/aletheia/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Ns81000/aletheia/discussions)
- **Contact**: Open an issue for questions

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes for their PRs
- GitHub Contributors page

## License

By contributing, you agree that your contributions will be licensed under the MIT License with attribution requirement.

---

**Thank you for contributing to Aletheia! 🎉**
