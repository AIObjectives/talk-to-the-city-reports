import subprocess, os


def update_rm():
    if not os.path.isfile("README.md"):
        print("No README.md")
        return
    try:
        r = subprocess.run(
            ["npm", "run", "test-update-readme"],
            capture_output=True,
            text=True,
            check=True,
        )
        out = f"\n```{r.stdout}```\n"
    except subprocess.CalledProcessError as e:
        out = f"\n```{e.output or 'No output'}```\n"
        pass
    with open("README.md") as f:
        c = f.readlines()
    h = "## Test coverage report\n"
    if h not in c:
        print("No heading")
        return
    i = c.index(h) + 1
    while i < len(c) and not c[i].startswith("##"):
        c.pop(i)
    c.insert(i, out)
    with open("README.md", "w") as f:
        f.writelines(c)
    print("Updated README.md")


if __name__ == "__main__":
    update_rm()
