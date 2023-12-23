import { Play } from "@/icons";

type VideoLinkProps = {
  video?: string,
  timestamp?: string,
  interview?: string,
  showThumbnail?: boolean,
  showVideo?: boolean
}

const VideoLink = ({ video, timestamp, interview, showThumbnail, showVideo }: VideoLinkProps) => {
  if (!video || !timestamp || !interview) return null
  if (!video!.includes('vimeo.com')) {
    console.error('Only Vimeo videos are supported at this time.')
    return false
  }
  const parts = video!.split('/');
  const videoId = parts[parts.length - 1];
  let [hours, minutes, seconds] = timestamp!.split(':').map(Number);
  let totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return <div className='my-4'>
    {(showThumbnail || showVideo) && <div className='text-sm font-semibold mb-1'>Source video:</div>}
    {showThumbnail && <img className="mt-2" width="320" height="240" src={`https://vumbnail.com/${videoId}.jpg`} alt="" />}
    {showVideo && <iframe src={`https://player.vimeo.com/video/${videoId}#t=${totalSeconds}s`} width="320" height="240" allow="autoplay; fullscreen; picture-in-picture"></iframe>}
  </div>
}

export default VideoLink