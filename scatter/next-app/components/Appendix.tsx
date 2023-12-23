import React, { useEffect, useState } from 'react'
import { Config } from '@/types'
import { Translator } from '@/hooks/useTranslatorAndReplacements'
import { diffWords } from "diff"

type Props = {
  config: Config,
  translator: Translator,
}
const Appendix = ({ config, translator }: Props) => {
  const { t, manualChanges } = translator
  const steps = ['extraction', 'embedding', 'clustering', 'labelling', 'takeaways', 'overview']
  return <div id="appendix">
    <hr className="h-px my-8 bg-gray-600 border-0 dark:bg-gray-700"></hr>
    <h2 className='text-3xl font-bold my-4 border-t-black'>{t("Appendix")}</h2>
    <div className='text-left mt-8'>
      {t("This report was generated using an AI pipeline that consists of the following steps")}:
      <div className="text-left list-outside list-disc ml-6 mt-4">
        {steps.map((step, i) => <StepInfo key={i} conf={(config as any)[step]} t={t} step={step} i={i} />)}
      </div>
      <ManualChanges manualChanges={manualChanges} t={t} />
    </div>
  </div>
}

const StepInfo = ({ conf, t, step, i }: { conf: any, t: any, step: string, i: number }) => {
  const [showCode, setShowCode] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  return <div key={step}>
    {t("Step")} {i + 1}: <span className='font-bold'>{t(step)}</span>
    {" - "}
    <span
      className='underline cursor-pointer'
      onClick={() => setShowCode(x => !x)}>
      {showCode ? t("hide code") : t("show code")}</span>
    {conf.prompt && <span>, <span
      className='underline mr-2 cursor-pointer'
      onClick={() => setShowPrompt(x => !x)}>
      {showPrompt ? t("hide prompt") : t("show prompt")}</span>({conf.model})</span>}
    <div>
      {showCode && <div className='my-4 border rounded p-4 bg-gray-50'>
        <pre className='text-xs'>
          {conf.source_code}
        </pre>
      </div>}
      {showPrompt && <div className='my-4 border rounded p-4 bg-gray-50'>
        <pre className='text-xs whitespace-pre-wrap'>
          {conf.prompt}
        </pre>
      </div>}
    </div>
  </div>
}


const ManualChanges = ({ manualChanges, t }: { manualChanges: any, t: any }) => {
  const [changes, setChanges] = useState<any>([])
  const [showChanges, setShowChanges] = useState(false)
  useEffect(() => {
    setChanges(manualChanges)
  }, [])
  return changes.length > 0 && <div className='mt-8'>
    {t("Some manual changes were also made to the report")}:{" "}
    <span
      className='underline mr-2 cursor-pointer'
      onClick={() => setShowChanges(x => !x)}>
      {showChanges ? t("hide changes") : t("show changes")}
      {changes && changes.length > 0 && ` (${changes.length})`}
    </span>
    {showChanges &&
      <ul className="text-left list-outside list-disc ml-6 mt-4">
        {changes.map((change: any, i: number) => <li key={i}>
          {diffWords(change.from, change.to).map((part: any, j: number) => <span key={`${i}/${j}`}>
            {part.added && <span className='bg-green-200'>{part.value}</span>}
            {part.removed && <span className='bg-red-200 line-through'>{part.value}</span>}
            {!part.added && !part.removed && <span>{
              part.value.length < 163 ?
                part.value :
                part.value.slice(0, 80) + ' ... ' + part.value.slice(part.value.length - 80)
            }</span>}
          </span>)}
        </li>)}
      </ul>}
  </div>
}

export default Appendix
