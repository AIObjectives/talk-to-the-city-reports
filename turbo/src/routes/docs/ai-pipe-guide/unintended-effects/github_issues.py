import requests
import time


def get_with_retry(url):
    max_retries = 5  # Maximum number of retries before giving up
    backoff_factor = 1  # Initial wait time multipliy factor
    for i in range(max_retries):
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 403:
            wait_time = backoff_factor * (2**i)
            print(f"Waiting {wait_time} seconds due to a 403 response...")
            time.sleep(wait_time)  # Wait exponentially longer each time
        else:
            response.raise_for_status()
    raise Exception("Maximum retries reached, cannot fetch data.")


def get_issues(url):
    return get_with_retry(url)


def get_comments(comments_url):
    return get_with_retry(comments_url)


ISSUES_URL = "https://api.github.com/repos/AIObjectives/talk-to-the-city-reports/issues"


def main():
    issues = get_issues(ISSUES_URL)
    all_issues_string = ""
    for issue in issues:
        all_issues_string += "Title: " + issue["title"] + "\n\n"
        all_issues_string += "URL: " + issue["html_url"] + "\n\n"
        all_issues_string += "Body:\n\n"
        all_issues_string += issue["body"] + "\n\n"
        all_issues_string += "-" * 80 + "\n\n"
    return all_issues_string


outputData = main()
