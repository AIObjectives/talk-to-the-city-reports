
import React, { useState, useEffect, use } from 'react';
import { Result, Argument, Point } from '@/types';
import Tooltip from '@/components/Tooltip';
import useAutoResize from '@/hooks/useAutoResize';
import useRelativePositions from '@/hooks/useRelativePositions';
import useVoronoiFinder from '@/hooks/useVoronoiFinder';
import useInferredFeatures from '@/hooks/useInferredFeatures';
import useZoom from '@/hooks/useZoom';
import useFilter from '@/hooks/useFilter';
import { mean } from '@/utils';
import { Translator } from '@/hooks/useTranslatorAndReplacements';
import { ColorFunc } from '@/hooks/useClusterColor';
import { isTouchDevice } from '@/utils';

type MapProps = Result & {
  width?: number,
  height?: number,
  padding?: number,
  className?: string,
  fullScreen?: boolean,
  back?: () => void,
  onlyCluster?: string,
  translator: Translator
  color: ColorFunc
}

function Map(props: MapProps) {

  const { fullScreen, back, onlyCluster, comments, translator, color } = props;
  const { dataHasVotes } = useInferredFeatures(props)
  const dimensions = useAutoResize(props.width, props.height);
  const clusters = useRelativePositions(props.clusters);
  const zoom = useZoom(dimensions, fullScreen);
  const findPoint = useVoronoiFinder(clusters, props.comments, color, zoom, dimensions, onlyCluster);
  const [tooltip, setTooltip] = useState<Point | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [minVotes, setMinVotes] = useState(0);
  const [minConsensus, setMinConsensus] = useState(50);
  const voteFilter = useFilter(clusters, comments, minVotes, minConsensus, dataHasVotes)

  if (!dimensions) {
    console.log('NO DIMENSIONS???')
    return <div
      className='m-auto bg-blue-50'
      style={{ width: props.width, height: props.height }} />
  }

  const { scaleX, scaleY, width, height } = dimensions;
  const { t } = translator

  return <div
    className='m-auto relative bg-blue-50'
    style={{ width, height, overflow: fullScreen ? 'hidden' : 'visible' }}
    onMouseLeave={() => { if (!expanded) setTooltip(null) }}
  >
    <svg width={width!} height={height!}
      {...isTouchDevice() ? {} : zoom.events({
        onClick: (e: any) => {
          if (tooltip && !expanded) {
            setExpanded(true)
            zoom.disable()
          } else {
            setExpanded(false)
            setTooltip(findPoint(e)?.data || null);
            zoom.enable()
          }
        },
        onMove: (e: any) => {
          if (!expanded) {
            setTooltip(findPoint(e)?.data || null);
          }
        },
        onDrag: () => {
          setTooltip(null)
        }
      })}>
      {/* DOT CIRCLES */}
      {clusters.map((cluster) =>
        cluster.arguments.filter(voteFilter.filter).map(({ arg_id, x, y }) =>
          <circle
            className='pointer-events-none'
            key={arg_id}
            id={arg_id}
            cx={zoom.zoomX(scaleX(x))}
            cy={zoom.zoomY(scaleY(y))}
            fill={color(cluster.cluster_id, onlyCluster)}
            opacity={(expanded && tooltip?.arg_id !== arg_id) ? 0.3 : 1}
            r={(tooltip?.arg_id === arg_id ? 8 : 4)} />
        ))}
    </svg>
    {/* CLUSTER LABELS */}
    {
      fullScreen && showLabels && !zoom.dragging && <div>{clusters.map((cluster) =>
        <div className='absolute opacity-90 bg-white p-2 max-w-lg rounded-lg pointer-events-none select-none transition-opacity duration-300'
          key={cluster.cluster_id}
          style={{
            transform: 'translate(-50%, -50%)',
            left: zoom.zoomX(scaleX(mean(cluster.arguments.map(({ x }) => x)))),
            top: zoom.zoomY(scaleY(mean(cluster.arguments.map(({ y }) => y)))),
            color: color(cluster.cluster_id, onlyCluster),
            opacity: (expanded) ? 0.3 : tooltip?.cluster_id == cluster.cluster_id ? 0 : 0.85,
          }}>
          {t(cluster.cluster)}
        </div>)}
      </div>
    }
    {/* TOOLTIP */}
    {
      tooltip && <Tooltip
        point={tooltip}
        dimensions={dimensions}
        zoom={zoom}
        expanded={expanded}
        fullScreen={fullScreen}
        translator={translator} />
    }
    {/* BACK BUTTON */}
    {fullScreen && <div className='absolute top-0 left-0'>
      <button
        className='m-2 underline'
        onClick={back}> {t("Back to report")}
      </button>
      <button
        className='m-2 underline'
        onClick={() => setShowLabels(x => !x)}>
        {showLabels ? t('Hide labels') : t('Show labels')}
      </button>
      {zoom.reset &&
        <button
          className='m-2 underline'
          onClick={zoom.reset as any}> {t("Reset zoom")}
        </button>}
      {dataHasVotes && <button className='m-2 underline' onClick={() => {
        setShowFilters(x => !x)
      }}>
        {showFilters ? t('Hide filters') : t('Show filters')}
      </button>}
      {/* FILTERS */}
      {showFilters && <div className="absolute w-[400px] top-12 left-2 p-2 border bg-white rounded leading-4">
        <div className='flex justify-between'>
          <button className='inline-block m-2 text-left'>
            {t("Votes")} {">"} <span className="inline-block w-10">{minVotes}</span>
          </button>
          <input
            className="inline-block w-[200px] mr-2"
            id="min-votes-slider"
            type="range"
            min="0"
            max="50"
            value={minVotes}
            onInput={(e) => {
              setMinVotes(parseInt((e.target as HTMLInputElement).value))
            }}
          />
        </div>
        <div className='flex justify-between'>
          <button className='inline-block m-2 text-left'>
            {t("Consensus")} {">"} <span className="inline-block w-10">{minConsensus}%</span>
          </button>
          <input
            className="inline-block w-[200px] mr-2"
            id="min-votes-slider"
            type="range"
            min="50"
            max="100"
            value={minConsensus}
            onInput={(e) => {
              setMinConsensus(parseInt((e.target as HTMLInputElement).value))
            }}
          />
        </div>
        <div className='text-sm ml-2 mt-2 opacity-70'>{t("Showing")} {voteFilter.filtered}/{voteFilter.total} {t("arguments")}</div>
      </div>}
    </div>
    }

  </div >
}

export default Map