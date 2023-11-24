# tttc-turbo

This application creates reports based on participant surveys.

https://tttc-turbo.web.app/report/test

## Nodes

To add pipeline computation nodes:

- add a TS type to `src/lib/node_data_types.d.ts`
- add the node to `src/lib/templates.ts`
  - add it to the `node_register` variable
- create a component as required, in `src/components`
  - register the component in `src/lib/node_types.ts`
- create the compute function in `src/lib/compute/`
  - import it and add it in `src/lib/compute.ts`
