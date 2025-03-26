
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  seasonNumber?: number;
  episodeNumber?: number;
}

const VideoPlayer = ({ tmdbId, type, seasonNumber, episodeNumber }: VideoPlayerProps) => {
  const [activeTab, setActiveTab] = useState("vidsrc");
  
  const videoSources = {
    vidsrc: `https://vidsrc.xyz/embed/${type}?tmdb=${tmdbId}${seasonNumber && episodeNumber ? `&season=${seasonNumber}&episode=${episodeNumber}` : ''}&ds_lang=Spanish`,
    multiembed: `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1${seasonNumber && episodeNumber ? `&s=${seasonNumber}&e=${episodeNumber}` : ''}`,
    embed2: `https://www.2embed.cc/embed/${tmdbId}${seasonNumber && episodeNumber ? `/s${seasonNumber}/e${episodeNumber}` : ''}`,
  };

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
        <div className="bg-black/80 p-2">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="vidsrc">VidSrc</TabsTrigger>
            <TabsTrigger value="multiembed">MultiEmbed</TabsTrigger>
            <TabsTrigger value="embed2">2Embed</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 w-full h-full">
          <TabsContent value="vidsrc" className="w-full h-full m-0">
            <iframe 
              className="w-full h-full" 
              src={videoSources.vidsrc} 
              allowFullScreen
              title="VidSrc Player"
            ></iframe>
          </TabsContent>
          
          <TabsContent value="multiembed" className="w-full h-full m-0">
            <iframe 
              className="w-full h-full" 
              src={videoSources.multiembed} 
              allowFullScreen
              title="MultiEmbed Player"
            ></iframe>
          </TabsContent>
          
          <TabsContent value="embed2" className="w-full h-full m-0">
            <iframe 
              className="w-full h-full" 
              src={videoSources.embed2} 
              allowFullScreen
              title="2Embed Player"
            ></iframe>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default VideoPlayer;
