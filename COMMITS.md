# Why Are There So Many update Commits?

If you look through Iconarium’s commit history, you’ll probably notice a lot of commits simply named:

update

This is intentional.

During development, I frequently use a package command I made for this project:

pnpm git

The command makes it quicker for me to commit and push changes while I’m actively working on Iconarium. Since I don’t always feel like coming up with a descriptive commit message for every small change, many of those commits simply use update.

Because of this, Iconarium may have:

* A large number of commits
* Multiple commits made close together
* Many commits with the same update message
* Small changes committed individually

This doesn’t mean every update commit represents a major feature or release. It’s mostly just how I prefer to work on and regularly push the project.

For larger changes, releases, or anything where the commit message is actually important, I may use a more descriptive message.

So, in short:

Lots of update commits = I was coding and was too lazy to name every commit.
