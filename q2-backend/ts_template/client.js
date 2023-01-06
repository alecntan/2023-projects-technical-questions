const response = fetch('http://127.0.0.1:8080/lassoable', {
  method: 'GET',
  headers: {
    'Content-Type' : 'application/json;charset=utf-8'
  },
  body: JSON.stringify({ 'message' : 'Hello' })
})