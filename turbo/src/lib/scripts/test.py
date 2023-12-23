import subprocess, os, json, re, pathlib


def convert_to_markdown(json_data):
    summary_table = """
| Metric                | Count |
|-----------------------|------:|
| Total Test Suites     | {numTotalTestSuites} |
| Passed Test Suites    | {numPassedTestSuites} |
| Failed Test Suites    | {numFailedTestSuites} |
| Pending Test Suites   | {numPendingTestSuites} |
| Total Tests           | {numTotalTests} |
| Passed Tests          | {numPassedTests} |
| Failed Tests          | {numFailedTests} |
| Pending Tests         | {numPendingTests} |
| Todo Tests            | {numTodoTests} |
""".format(
        **json_data
    )

    details = []
    for index, suite in enumerate(json_data["testResults"], start=1):
        name = suite["name"]
        filename = name.split("src/test")[1]
        short_filename = pathlib.Path(filename).name
        detail_heading = f"### `[{index}]` [{short_filename}](./src/test/{filename})"
        test_table_header = "| Test | Status | Duration (ms) |\n|---|---|---:|\n"
        test_table_body = "\n".join(
            "| *{}* | **{}** | `{}` |".format(
                test["title"], test["status"], test["duration"]
            )
            for test in suite["assertionResults"]
        )
        details.append(f"{detail_heading}\n{test_table_header}{test_table_body}")

    return f"\n\n{summary_table}\n" + "\n\n".join(details)


def update_readme():
    if not os.path.isfile("README.md"):
        print("No README.md")
        return

    result = subprocess.run(
        ["npx", "vitest", "--reporter", "json", "--run"],
        capture_output=True,
        text=True,
    )

    if result.returncode == 0:
        json_data = json.loads(result.stdout)
        markdown_result = convert_to_markdown(json_data)

        with open("README.md") as f:
            content = f.read()

        # Use regex to be flexible with finding the 'Test Results' heading
        test_results_header_regex = re.compile(
            r"(\n\#{2}\s*Test\s+Results\b.*?\n)", re.IGNORECASE
        )
        match = test_results_header_regex.search(content)

        if (
            match
        ):  # If the heading exists, replace the following section until next heading
            start_index = match.start()
            end_index = re.search(
                r"\n(\#{2}\s)", content[start_index + len(match.group(1)) :]
            )
            end_index = (
                end_index.start() + start_index + len(match.group(1))
                if end_index
                else len(content)
            )

            new_content = (
                content[:start_index]
                + "\n"
                + match.group(  # Ensure one newline before the heading (avoiding extra empty lines)
                    1
                ).rstrip()
                + "\n"
                + markdown_result.strip()  # The matched '## Test Results' heading
                + "\n"
                + content[  # New markdown result with no surrounding whitespace
                    end_index:
                ]  # Rest of original content
            )
        else:  # If the heading doesn't exist, append it
            new_content = (
                content.rstrip()
                + "\n\n"
                + "## Test Results\n"
                + markdown_result.strip()
                + "\n"
            )

        with open("README.md", "w") as f:
            f.write(new_content)
        print("Updated README.md")
    else:
        print(f"Test run failed: {result.stderr}")


if __name__ == "__main__":
    update_readme()
