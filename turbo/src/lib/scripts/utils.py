from rich import print


def name_to_node(name):
    return f"src/lib/compute/{name}.ts"


def name_to_test(name):
    return f"src/test/{name}.test.ts"


def name_to_doc(name):
    return f"src/lib/docs/{name}.ts"


def name_to_prompt(name, func):
    return file_to_prompt(func(name))


def file_to_prompt(name):
    return f"""\    

{name.strip()}:

{open(name, "r").read().strip()}

##############
    """.strip()


def test_to_prompts(name):
    return "\n".join(name_to_prompt(n, name_to_test) for n in name).strip()


def node_to_prompts(name):
    return "\n".join(name_to_prompt(n, name_to_node) for n in name).strip()


def file_to_prompts(name):
    return "\n".join(file_to_prompt(n) for n in name).strip()
