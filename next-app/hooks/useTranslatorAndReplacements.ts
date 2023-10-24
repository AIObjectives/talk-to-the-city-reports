import { useCallback, useMemo, useState } from "react";
import { Config, Translations, Cluster } from "@/types";
import * as OpenCC from "opencc-js";

let missing: { [key: string]: boolean } = {};

const useTranslatorAndReplacements = (
  config: Config,
  translations: Translations,
  clusters: Cluster[]
) => {
  const [langIndex, setLangIndex] = useState(0);
  const languages = useMemo(() => {
    const translation = config?.translation;
    const names = translation?.languages || [];
    const flags = translation?.flags || [];
    return [
      {
        name: "English",
        flag: "US",
      },
      ...names.map((name, index) => ({
        name,
        flag: flags[index],
      })),
    ];
  }, []);
  const fixLocalLang = useMemo(() => {
    if (languages[langIndex].flag === "TW") {
      return OpenCC.Converter({ from: "cn", to: "twp" });
    } else {
      return (x: string) => x;
    }
  }, [languages[langIndex].flag]);

  const { replaceAll, manualChanges } = useMemo(() => {
    const memory: { [input: string]: string } = {};
    const replacements = config?.visualization?.replacements || [];
    const manualChanges: { from: string; to: string }[] = [];
    let trackChanges = true;
    const replaceAll = (inputString: string) => {
      if (replacements.length === 0) return inputString;
      if (memory[inputString]) return memory[inputString];
      let modifiedString = inputString;
      replacements.forEach((pair) => {
        const { replace, by } = pair;
        modifiedString = modifiedString.split(replace).join(by);
      });
      if (trackChanges && modifiedString !== inputString)
        manualChanges.push({ from: inputString, to: modifiedString });
      memory[inputString] = modifiedString;
      return modifiedString;
    };
    // apply one to all clusters to pre-compute all important replacements
    // TODO: apply translations first if replacements are not for primary language
    clusters.forEach((cluster) => {
      replaceAll(cluster.cluster);
      replaceAll(cluster.takeaways || "");
      cluster.arguments.forEach((arg) => {
        replaceAll(arg.argument);
      });
    });
    trackChanges = false;
    return { replaceAll, manualChanges };
  }, [langIndex]);

  const t = useCallback(
    (txt?: string) => {
      if (!txt) return txt;
      if (langIndex === 0) return replaceAll(txt);
      const result = translations[txt]?.[langIndex - 1];
      if (!result) {
        if (!missing[txt]) {
          missing[txt] = true;
          console.log(`Missing translation for "${txt}"`);
        }
      }
      return fixLocalLang(replaceAll(result || txt));
    },
    [langIndex, replaceAll]
  );
  return { languages, setLangIndex, langIndex, t, manualChanges };
};

export type Translator = ReturnType<typeof useTranslatorAndReplacements>;

export default useTranslatorAndReplacements;
