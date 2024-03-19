async function hello(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Succes' }),
  };
}

export const handler = hello;


