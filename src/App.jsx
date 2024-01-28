import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import { getLanguages, translateText } from "./redux/translateActions";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { setTranslated, translateSlice } from "./redux/translateSlice";
import Loading from "./components/Loading";

const App = () => {
  const state = useSelector((store) => store.translate);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const [sourceLang, setSourceLang] = useState({
    label: "English",
    value: "en",
  });

  const [targetLang, setTargetLang] = useState({
    label: "Turkish",
    value: "tr",
  });

  // API'den verileri al
  useEffect(() => {
    dispatch(getLanguages());
  }, []);

  const refinedData = useMemo(
    () =>
      state.languages.map((lang) => ({
        label: lang.name,
        value: lang.code,
      })),
    [state.languages]
  );

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang)

    setText(state.translatedText)
    dispatch(setTranslated(text))
  }
  return (
    <div id="main-page">
      <div className="container">
        <h1>Çeviri +</h1>
        {/* üst kısım */}
        <div className="upper">
          <Select
            className="select"
            options={refinedData}
            onChange={setSourceLang}
            value={sourceLang}
            isLoading={state.isLangsLoading}
            isDisabled={state.isLangsLoading}
          />
          <button onClick={handleSwap}>Değiş</button>
          <Select
            className="select"
            options={refinedData}
            onChange={setTargetLang}
            value={targetLang}
            isLoading={state.isLangsLoading}
            isDisabled={state.isLangsLoading}
          />
        </div>
        {/* orta kısım */}
        <div className="middle">
          <div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            {state.isTranslateLoading && (
             <Loading/> 
            )}
            <textarea value={state.translatedText} disabled />
          </div>
        </div>
        {/* alt kısım */}
        <button
          onClick={() =>
            dispatch(translateText({ sourceLang, targetLang, text }))
          }
        >
          Çevir
        </button>
      </div>
    </div>
  );
};

export default App;
