
import subprocess


def visualization(config):
    output_dir = config['output_dir']
    with open(f"outputs/{output_dir}/result.json") as f:
        result = f.read()

    cwd = "../next-app"
    command = f"REPORT={output_dir} npm run build"

    try:
        process = subprocess.Popen(command, shell=True, cwd=cwd, stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE, universal_newlines=True)
        while True:
            output_line = process.stdout.readline()
            if output_line == '' and process.poll() is not None:
                break
            if output_line:
                print(output_line.strip())
        process.wait()
        errors = process.stderr.read()
        if errors:
            print("Errors:")
            print(errors)
    except subprocess.CalledProcessError as e:
        print("Error: ", e)
