all: test

lint:
	black --check pipeline

reformat:
	black pipeline

test: lint

.PHONY: lint test reformat
