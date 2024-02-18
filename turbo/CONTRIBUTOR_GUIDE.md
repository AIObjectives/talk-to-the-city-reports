# Contributor Guide

So you would like to make some changes to Talk to the City. This guide will not make too many assumptions about your level of proficiency, as such it is quite broad and may cover things you are already familiar with.

## Cloning

If you are part of the organization or are a collaborator with direct access, you can simply clone https://github.com/AIObjectives/talk-to-the-city-reports.git else you'll first need to fork the repo, and clone your fork instead.

Your fork has the same URL as ours, but with your username e.g:

https://github.com/[your-username]/talk-to-the-city-reports.git

## Editor settings

You should open the `/turbo` directory directly in your Editor, so it properly picks up all the configuration files for formatting, testing etc.

## Feature branches

The workflow thus far has been to work in feature branches, and merging those branches into main via PRs. We may switch to working from a 'dev' branch. But for now, it's either main or a feature branch.

## Issues

If you intend working on something, we recommend logging an issue first, and describing the change as this will provide an opportunity for other contributors to comment early. However if you are sure and want to go straight to the PR stage, logging an issue is not a strict requirement.

## Commits

If you are working on an issue, then please add the issue number at the end of your commit, e.g

`translate "claims in" in new UI [#138]`

This way, your commit will appear in the issue, and the issue author is notified. Commits of all sizes are welcome, and multiple commits per PR are also fine.

## Reworking Code after PR comments

Once you have submitted a PR, it will be reviewed by the repo owner or a collaborator. You may be asked to rework your code. This can be a somewhat tedious process, but it is very standard when contributing to Open Source repos.

You should commit your reworks as [fixup commits](https://robots.thoughtbot.com/autosquashing-git-commits) as this makes iterating on your PR with you easier for the reviewer.

## VSCode Extensions

- [svelte](https://marketplace.visualstudio.com/items?itemName=1YiB.svelte-bundle) - Bundle of svelte extensions for better development.
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Prettier extension used for formatting Typescript files.

Nice to have:

- [ChatGPT - Genie AI](https://marketplace.visualstudio.com/items?itemName=genieai.chatgpt-vscode) (in case you don't have co-pilot. It is not as context-aware, but can be used with your OpenAI key).
- [Black Formatter](https://marketplace.visualstudio.com/items?itemName=ms-python.black-formatter) - the few Python scripts we have are formatted with Black.
- [Hide Gitignored](https://marketplace.visualstudio.com/items?itemName=npxms.hide-gitignored)
