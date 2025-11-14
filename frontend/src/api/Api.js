/**
 * API WRAPPER FOR VOICE SHOPPING ASSISTANT FRONTEND
 */

const BASE_URL = "http://localhost:8080";

//--------------------------------------------------------
// TOKEN HELPERS
//--------------------------------------------------------
export function getToken() {
  return localStorage.getItem("vsa_token");
}

export function setToken(token) {
  localStorage.setItem("vsa_token", token);
}

export function clearToken() {
  localStorage.removeItem("vsa_token");
}

//--------------------------------------------------------
// UNIFIED REQUEST WRAPPER
//--------------------------------------------------------
async function request(path, method = "GET", body = null, includeAuth = true) {
  const headers = { "Content-Type": "application/json" };

  if (includeAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (!res.ok) {
    let msg = "Request failed";
    try {
      const err = await res.json();
      msg = err.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

//--------------------------------------------------------
// AUTH ENDPOINTS
//--------------------------------------------------------
const Auth = {
  login: async (username, password) => {
    const data = await request(
      "/api/auth/login",
      "POST",
      { username, password },
      false
    );

    if (data.token) setToken(data.token);
    return data;
  },

  register: async (username, email, password) => {
    const data = await request(
      "/api/auth/register",
      "POST",
      { username, email, password },
      false
    );

    if (data.token) setToken(data.token);
    return data;
  },

  logout: () => {
    clearToken();
  }
};

//--------------------------------------------------------
// VOICE ENDPOINTS
//--------------------------------------------------------
const Voice = {
  parse: async (englishText) => {
    return await request("/api/voice/parse", "POST", { text: englishText });
  },

  apply: async (payload) => {
    return await request("/api/voice/apply", "POST", payload);
  }
};

//--------------------------------------------------------
// SUGGESTIONS ENDPOINTS
//--------------------------------------------------------
const Suggestions = {
  getSuggestions: async (userId = null) => {
    const url = userId
      ? `/api/suggestions?userId=${encodeURIComponent(userId)}`
      : `/api/suggestions`;
    return await request(url, "GET");
  },

  getByCategory: async (category) => {
    return await request(`/api/suggestions/category/${category}`, "GET");
  },

  getSubstitutes: async (parsedIntent) => {
    return await request(`/api/suggestions/substitutes`, "POST", parsedIntent);
  }
};

//--------------------------------------------------------
// PRODUCTS ENDPOINTS
//--------------------------------------------------------
const Products = {
  search: async (query) => {
    return await request(
      `/api/products/search?query=${encodeURIComponent(query)}`,
      "GET"
    );
  },

  getAll: async () => {
    return await request(`/api/products`, "GET");
  },

  getByCategory: async (category) => {
    return await request(`/api/products/category/${category}`, "GET");
  },

  add: async (product) => {
    return await request(`/api/products`, "POST", product);
  },

  delete: async (id) => {
    return await request(`/api/products/${id}`, "DELETE");
  }
};

//--------------------------------------------------------
// LOCAL LANGUAGE DETECTOR + BASIC TRANSLATOR
//--------------------------------------------------------

// Unicode ranges for major Indian languages
const hindiChars = /[\u0900-\u097F]/;
const tamilChars = /[\u0B80-\u0BFF]/;
const teluguChars = /[\u0C00-\u0C7F]/;
const kannadaChars = /[\u0C80-\u0CFF]/;
const malayalamChars = /[\u0D00-\u0D7F]/;

// Basic Hindi dictionary
const smallHindiToEnglish = {
  "ek": "one",
  "do": "two",
  "teen": "three",
  "char": "four",
  "paanch": "five",
  "chhe": "six",
  "saath": "seven",
  "aath": "eight",
  "nau": "nine",
  "das": "ten",
  "jodo": "add",
  "nikalo": "remove",
  "ghatao": "remove",
  "baahar": "remove"
};

const Translate = {
  async toEnglish(text) {
    const lower = text.toLowerCase();

    // Script-based language detection
    if (hindiChars.test(text)) {
      return { text, detectedLang: "hi" };
    }
    if (tamilChars.test(text)) {
      return { text, detectedLang: "ta" };
    }
    if (teluguChars.test(text)) {
      return { text, detectedLang: "te" };
    }
    if (kannadaChars.test(text)) {
      return { text, detectedLang: "kn" };
    }
    if (malayalamChars.test(text)) {
      return { text, detectedLang: "ml" };
    }

    // Rule-based Hindi → English conversion
    let words = lower.split(" ");
    let mapped = words.map((w) => smallHindiToEnglish[w] || w);
    let converted = mapped.join(" ");

    return {
      text: converted,
      detectedLang: "en-or-hi"
    };
  }
};

//--------------------------------------------------------
// EXPORT FINAL API OBJECT
//--------------------------------------------------------
const Api = {
  Auth,
  Voice,
  Products,
  Suggestions,
  Translate
};

export default Api;
