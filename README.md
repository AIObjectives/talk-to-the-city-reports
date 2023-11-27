# tttc-turbo

This application creates reports based on participant surveys.

https://tttc-turbo.web.app/report/test

## Nodes

To add pipeline computation nodes:

- create the compute function in `src/lib/compute/`
- create a component as required, in `src/components/`
- register the component and compute function in `src/lib/node_types.ts`
