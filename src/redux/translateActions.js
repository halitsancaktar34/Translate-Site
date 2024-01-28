import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { options } from "./../constants/index";

// Dillerin verisini alır
export const getLanguages = createAsyncThunk(
  "translate/getLanguages",
  async () => {
    const res = await axios.request(options);

    return res.data.data.languages;
  }
);

export const translateText = createAsyncThunk(
  "translate/text",
  async ({ sourceLang, targetLang, text }) => {
    const encodedParams = new URLSearchParams();
    encodedParams.set("source_language", sourceLang.value);
    encodedParams.set("target_language", targetLang.value);
    encodedParams.set("text", text);

    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "53bbfd6a45mshba00130ed68b464p12d86djsn5d5b28fac991",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: encodedParams,
    };
    // API isteği atar
    const res = await axios.request(options);
    return res.data.data.translatedText;
  }
);
