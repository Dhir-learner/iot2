## Git Commands for Project Management

# Initial setup (already done)
git init
git add .
git commit -m "Initial commit: Complete IoT Door Lock Security System"

# Create GitHub repository and connect
git remote add origin https://github.com/yourusername/iot-door-lock-server.git
git branch -M main
git push -u origin main

# Daily workflow
git add .
git commit -m "Update: description of changes"
git push

# Check status
git status
git log --oneline

# Create branches for features
git checkout -b feature/new-feature
git checkout main
git merge feature/new-feature

# Update from remote
git pull origin main

# View changes
git diff
git diff --staged