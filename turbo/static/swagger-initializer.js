function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
  {
    const val = parts.pop().split(';').shift()
    return val;
  }
}

async function getApiSpec()
{
  try {
    const response = await fetch('/api/spec');
    const apiSpec = await response.json();
    if (!apiSpec.paths || Object.keys(apiSpec.paths).length === 0) {
      return '/swagger.json';
    }
  } catch (e)
  {
  }
  return '/api/spec';
}


window.onload = async function () {
  const url = await getApiSpec();

  window.ui = SwaggerUIBundle({
    url,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    requestInterceptor: (request) =>
    {
      const token = getCookie('user_token');
      request.headers.Authorization = `Bearer ${token}`;
      return request;
    }
  });
}