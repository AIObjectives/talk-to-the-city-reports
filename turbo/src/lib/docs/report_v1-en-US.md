The report_v1 node simply makes the extraction data available to the rest of the user interface.

It takes two inputs: the merged report data, and the original csv data. It was created for more complex reports which may have more than one CSV node, or reports where the data is being read via a JSON node. In these cases, the original data needs to be made explicit via a connection, warranting the use of the report_v1 node.
