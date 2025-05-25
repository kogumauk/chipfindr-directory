# GitHub Usage Guidelines - ChipFindr Project

## 🌟 Repository Information
- **Repository**: `kogumauk/chipfindr-directory`
- **Main Branch**: `main`
- **Default Branch Protection**: Enabled for production stability

## 🔀 Branching Strategy

### Branch Types & Naming Convention

```
main                    # Production-ready code
├── feature/seo-meta-tags      # New features
├── bugfix/search-filter-issue # Bug fixes  
├── hotfix/critical-security   # Critical production fixes
├── docs/update-readme         # Documentation updates
└── refactor/location-utils    # Code improvements
```

### Branch Naming Rules
- **Features**: `feature/short-description`
- **Bug Fixes**: `bugfix/issue-description`
- **Hotfixes**: `hotfix/critical-issue`
- **Documentation**: `docs/what-updating`
- **Refactoring**: `refactor/component-name`

### Workflow Process

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/seo-implementation
   ```

2. **Develop & Commit Regularly**
   ```bash
   git add .
   git commit -m "feat: add JSON-LD structured data for businesses"
   git push origin feature/seo-implementation
   ```

3. **Create Pull Request**
   - Use descriptive title and description
   - Link related issues
   - Add reviewers if applicable

4. **Merge & Cleanup**
   ```bash
   # After PR approval
   git checkout main
   git pull origin main
   git branch -d feature/seo-implementation
   ```

## 📝 Commit Message Standards

### Format
```
<type>(<scope>): <subject>

<body>
<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build process, dependencies

### Examples
```bash
feat(search): implement advanced filtering system
fix(location): resolve postcode validation issue
docs(readme): update installation instructions
perf(search): optimize client-side search performance
```

## 🔍 Pull Request Guidelines

### PR Template Checklist
- [ ] **Title**: Clear, descriptive summary
- [ ] **Description**: What changes were made and why
- [ ] **Testing**: How was this tested?
- [ ] **Screenshots**: UI changes (if applicable)
- [ ] **Documentation**: Updated relevant docs
- [ ] **Performance**: No significant performance impact

### Review Process
1. **Self-Review**: Review your own PR first
2. **Automated Checks**: Ensure all checks pass
3. **Manual Testing**: Test functionality locally
4. **Code Review**: Address feedback promptly

## 📋 Issue Management

### Issue Labels
- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `priority: high` - Urgent fixes needed
- `phase-2`, `phase-3` - Implementation phases

### Issue Templates
```markdown
## Bug Report
- **Expected Behavior**: 
- **Actual Behavior**: 
- **Steps to Reproduce**:
- **Environment**: Browser, OS, Node version

## Feature Request
- **Problem**: What problem does this solve?
- **Solution**: Describe your proposed solution
- **Alternatives**: Other solutions considered
```

## 🚀 Release Management

### Version Strategy
- **Major** (1.0.0): Breaking changes, major features
- **Minor** (0.1.0): New features, backward compatible
- **Patch** (0.0.1): Bug fixes, small improvements

### Release Process
1. **Create Release Branch**: `release/v1.2.0`
2. **Update Version**: package.json, documentation
3. **Test Thoroughly**: All functionality
4. **Merge to Main**: Via pull request
5. **Tag Release**: `git tag v1.2.0`
6. **Deploy**: Automated or manual deployment

## 🛠️ Development Workflow

### Local Development Setup
```bash
# Clone and setup
git clone https://github.com/kogumauk/chipfindr-directory.git
cd chipfindr-directory
npm install

# Create feature branch
git checkout -b feature/your-feature-name

# Start development
npm run dev

# Regular commits
git add .
git commit -m "feat: implement new feature"
git push origin feature/your-feature-name
```

### Before Committing
- [ ] **Lint**: Run `npm run lint` (when available)
- [ ] **Build**: Ensure `npm run build` succeeds
- [ ] **Test**: Run any available tests
- [ ] **Review**: Check diff for unnecessary changes

## 🔒 Security & Best Practices

### Sensitive Information
- **Never commit**: API keys, passwords, credentials
- **Use**: `.env` files (already in .gitignore)
- **Environment Variables**: Documented in `.env.example`

### Code Quality
- **TypeScript**: Use strict typing
- **Comments**: Document complex logic
- **Console Logs**: Remove before committing
- **Dependencies**: Keep updated and minimal

## 🤝 Collaboration Guidelines

### Communication
- **Descriptive Commits**: Others should understand changes
- **PR Discussions**: Use GitHub comments for context
- **Issues**: Reference related issues in PRs (`Fixes #123`)

### Code Reviews
- **Be Constructive**: Suggest improvements, don't just criticize
- **Be Responsive**: Address feedback promptly
- **Learn**: Code reviews are learning opportunities

### Project Phases
- **Phase 2**: Core functionality (95% complete)
- **Phase 3**: SEO & Performance (current target)
- **Phase 4**: Advanced features (search, maps)

## 📊 Monitoring & Maintenance

### Regular Tasks
- **Dependencies**: Monthly updates
- **Security**: Monitor for vulnerabilities  
- **Performance**: Regular Lighthouse audits
- **Documentation**: Keep roadmap updated

### Branch Cleanup
```bash
# List merged branches
git branch --merged main

# Delete merged branches
git branch -d feature/completed-feature

# Clean remote tracking branches
git remote prune origin
```

---

## 🎯 Quick Reference Commands

```bash
# Setup new feature
git checkout main && git pull && git checkout -b feature/name

# Commit with message
git add . && git commit -m "feat: description"

# Push and create PR
git push origin feature/name

# Sync with main
git checkout main && git pull && git checkout feature/name && git merge main

# Clean up after merge
git checkout main && git pull && git branch -d feature/name
```

**Remember**: Keep commits atomic, branches focused, and PRs small for easier review! 🚀
