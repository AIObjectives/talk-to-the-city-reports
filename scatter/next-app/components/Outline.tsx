import { Translator } from "@/hooks/useTranslatorAndReplacements"
import { Cluster } from "@/types"

type Props = {
  clusters: Cluster[],
  translator: Translator,
}

const Section = ({ name, target, small }: { name: string, target: string, small?: boolean }) => {
  let className = "opacity-60 hover:opacity-100 cursor-pointer"
  if (small) className += " text-xs ml-2  max-w-xs  line-clamp-1 leading-6"
  return <h2 className={className} onClick={() => {
    const elem = document.getElementById(target)!
    window.scrollTo({ top: elem.offsetTop - 50, behavior: 'smooth' })
  }}>{name}</h2>
}

const Outline = ({ clusters, translator }: Props) => {
  const { t } = translator
  return <div className='hidden xl:block fixed left-0 top-0 h-full text-left mt-8 opacity-40 hover:opacity-100 leading-10 transition-all'>
    <div className="text-left list-outside list-disc ml-2 mt-4">
      <Section name={t("Introduction")!} target="introduction" />
      <Section name={t("Clusters")!} target="clusters" />
      {clusters.map((cluster, i) => <Section small key={i} name={t(cluster.cluster)!}
        target={'cluster-' + cluster.cluster_id}
      />)}
      <Section name={t("Appendix")!} target="appendix" />
    </div>
  </div >
}

export default Outline