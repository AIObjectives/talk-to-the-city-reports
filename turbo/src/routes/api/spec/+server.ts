import swaggerJsdoc from 'swagger-jsdoc';
import _ from 'lodash';
import fs from 'fs';

export async function GET({ url, request }) {
  const options = {
    failOnErrors: true,
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Talk to the City Turbo',
        version: '0.0.1'
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [
        {
          BearerAuth: []
        }
      ]
    },
    apis: ['./src/routes/api/**/+server.ts']
  };

  const spec = swaggerJsdoc(options);
  fs.writeFile('static/swagger.json', JSON.stringify(spec, null, 2), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Swagger JSON successfully written to static/swagger.json');
    }
  });

  return new Response(JSON.stringify(spec, null, 2), { status: 200 });
}
