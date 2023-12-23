import { useMemo } from "react";
import { Result } from "@/types";

const useInferredFeatures = (props: Result) => {
  return useMemo(() => {
    const { config, comments } = props;
    const comment0 = comments[Object.keys(comments)[0]];
    const langs = config.translation?.languages || [];
    return {
      dataHasVotes: comment0.hasOwnProperty("agrees"),
      hasTranslations: langs.length > 0,
    };
  }, []);
};

export default useInferredFeatures;
