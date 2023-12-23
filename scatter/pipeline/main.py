import os
import sys
import json
from datetime import datetime

from steps.embedding import embedding
from steps.extraction import extraction
from steps.clustering import clustering
from steps.labelling import labelling
from steps.takeaways import takeaways
from steps.overview import overview
from steps.aggregation import aggregation
from steps.visualization import visualization
from steps.translation import translation

from utils import initialization, termination, run_step


def main():

    config = initialization(sys.argv)

    try:
        run_step('extraction', extraction, config)
        run_step('embedding', embedding, config)
        run_step('clustering', clustering, config)
        run_step('labelling', labelling, config)
        run_step('takeaways', takeaways, config)
        run_step('overview', overview, config)
        run_step('translation', translation, config)
        run_step('aggregation', aggregation, config)
        run_step('visualization', visualization, config)
        termination(config)
    except Exception as e:
        termination(config, error=e)


if __name__ == "__main__":
    main()
