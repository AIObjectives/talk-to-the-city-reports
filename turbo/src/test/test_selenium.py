#!/usr/bin/env python3

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import chromedriver_autoinstaller
from pyvirtualdisplay import Display

import argparse

parser = argparse.ArgumentParser(description="Run the script locally or not")
parser.add_argument(
    "--local", dest="run_locally", action="store_true", help="Run the script locally"
)

args = parser.parse_args()

urls = ["https://tttc-turbo.web.app", "http://localhost:5173"]

url = urls[args.run_locally]

display = Display(visible=0, size=(800, 800))
display.start()

chromedriver_autoinstaller.install()

chrome_options = webdriver.ChromeOptions()
options = ["--window-size=1200,1200", "--ignore-certificate-errors"]

for option in options:
    chrome_options.add_argument(option)

driver = webdriver.Chrome(options=chrome_options)


def test_in(path, text):
    print(f"Testing: {path}")
    driver.get(path)
    WebDriverWait(driver, 120).until(
        EC.text_to_be_present_in_element((By.TAG_NAME, "body"), text)
    )


def test_report(name):
    print(f"Testing: {name}")
    driver.get(f"{url}/report/{name}")
    WebDriverWait(driver, 120).until(
        EC.text_to_be_present_in_element((By.TAG_NAME, "body"), "Show more")
    )
    assert "Show more" in driver.page_source
    assert "Subtopics" in driver.page_source
    assert "Claims" in driver.page_source
    assert "AI Objectives Institute" in driver.page_source
    assert "Home" in driver.page_source
    assert "About" in driver.page_source
    assert "Sign in" in driver.page_source
    assert "Fork Report" in driver.page_source


tests = ["mina-protocol", "heal-michigan-9", "taiwan-zh", "台灣初步測試"]


def test_other():
    test_in(f"{url}/report/heal-michigan", "The need for different organizations to work together to maximize impact")
    if not args.run_locally:
        test_in(f"https://tttc-turbo-hm.web.app/report/heal-michigan", "The need for different organizations to work together to maximize impact")
    test_in(f"{url}/docs", "the anon viewer")
    test_in(f"{url}/docs/nodes", "argument_extraction_v0")
    test_in(f"{url}/api-docs", "Please sign in")
    test_in(f"{url}/about", "About")
    test_in(f"{url}/api.html", "{dataset}")
    test_in(f"{url}/login", "Sign in with Google")
    test_in(f"{url}/static-report", "Re-entry Challenges")
    test_in(f"{url}/docs/ai-pipe-guide/unintended-effects", "In the chat node")
    # todo: need to make pipeline visible to anon users
    # test_in(f"{url}/docs/ai-pipe-guide/unintended-effects", "We use your API key")


test_other()

for test in tests:
    test_report(test)


driver.close()
