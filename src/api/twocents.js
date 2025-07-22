const API_URL = import.meta.env.VITE_API_URL;

export async function callJsonRpc(method, params, id = Date.now()) {
  console.log("check the params", params);
  const body = {
    jsonrpc: "2.0",
    id,
    method,
    params,
  };
  console.log("JSON-RPC Request:", JSON.stringify(body));

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  console.log("check the data here", data);
  if (data.error)
    throw new Error(`RPC ${data.error.code}: ${data.error.message}`);
  return data.result;
}
