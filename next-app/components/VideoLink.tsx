import { Play } from "@/icons";

type VideoLinkProps = {
  video?: string,
  timestamp?: string,
  interview?: string
}

const VideoLink = ({ video, timestamp, interview }: VideoLinkProps) => {
  if (!video || !timestamp || !interview) return null
  if (!video!.includes('vimeo.com')) {
    console.error('Only Vimeo videos are supported at this time.')
    return false
  }
  const parts = video!.split('/');
  const videoId = parts[parts.length - 1];
  let [hours, minutes, seconds] = timestamp!.split(':').map(Number);
  let totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const link = `https://vimeo.com/${videoId}#t=${totalSeconds}s`
  return <div className='my-4'>
    <div className='text-sm font-semibold mb-2'>Source video:</div>
    <a className="relative" href={link} target="_blank">
      <img className="" src={`https://vumbnail.com/${videoId}.jpg`} alt="" />
      <div className='absolute bottom-0 left-0 bg-black px-4 text-sm  text-center mb-2 opacity-70'>
        <Play className='w-5 h-5 text-white inline-block' />
        <span className='text-white'>{interview}</span>
      </div>
    </a>
  </div>
}

export default VideoLink