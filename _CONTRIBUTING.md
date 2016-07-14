1. Fork the FoodBuddy repository on GitHub and clone your fork to your development environment
git clone git@github.com:YOUR-GITHUB-USERNAME/FoodBuddy.git

2. Add the main FoodBuddy repository as an additional git remote called "upstream"
git remote add upstream git://github.com/Piquant-Toothbrush/FoodBuddy

3. To keep your local repository master branch in sync you must do a rebase from the upstream repository to your local master branch before you make a new set of changes
git pull --rebase upstream master

4. Keep master branch up to date with the upstream master branch, and create specific branches for changes and features you want to create
git checkout -b feature-branch

5. Create changes and commit frequently

6. Before push changes to the your forked repo, do a rebase to make sure you have all the updates from the upstream repo
git pull --rebase upstream master

7. After rebasing, push your changes on the feature branch to the feature branch of your forked repo
git push origin feature-branch

8. Submit a pull request

9. If you need to make additional revisions before pull request gets merged, make new commits and push to the feature branch of your forked repo, your changes will be incorporated in the pull request.
git push origin feature-branch

--Summary--
1. git checkout master
2. git pull --rebase upstream master
3. git checkout -b feature-branch
4. edit / git add / git commit
5. git pull --rebase upstream master
6. git push origin feature-branch
7. Submit pull request

if pull request merged:
	8. make more commits to feature-branch
	9. git push origin feature branch
else:
	8. git checkout master
	9. git pull --rebase upstream master
