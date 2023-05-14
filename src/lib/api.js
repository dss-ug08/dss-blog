import { error } from "@sveltejs/kit";

const base_url = "http://80.192.231.142:5173/api";

async function send({ method, path, data, token }) {

  const opts = { method, headers: {} };

  console.log("\n\nEXTERNAL API >> Login API Reached");

  if (data) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(data);
  }

  if (token) {
    opts.headers["sessionid"] = `${token}`;
  }

  console.log("Starting POST request. . .");
  const res = await fetch(`${base_url}/${path}`, opts);


  if (res.ok || res.status === 422) {
    return res;
  }

  throw error(res.status);

}

export function get(path, token) {
  return send({ method: "GET", path, token });
}

export function del(path, token) {
  return send({ method: "DELETE", path, token });
}

export function post(path, data, token) {
  return send({ method: "POST", path, data, token });
}

export function put(path, data, token) {
  return send({ method: "PUT", path, data, token });
}
