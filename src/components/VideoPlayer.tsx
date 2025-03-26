
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  seasonNumber?: number;
  episodeNumber?: number;
}

const VideoPlayer = ({ tmdbId, type, seasonNumber, episodeNumber }: VideoPlayerProps) => {
  // For TV episodes with season and episode numbers, use the autoembed.co link
  if (type === 'tv' && seasonNumber && episodeNumber) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
        <DialogClose className="absolute right-2 top-2 z-50 p-1 rounded-full bg-black/70 hover:bg-black text-white">
          <X className="h-5 w-5" />
        </DialogClose>
        <iframe 
          className="w-full h-full" 
          src={`https://autoembed.co/tv/tmdb/${tmdbId}-${seasonNumber}-${episodeNumber}`}
          allowFullScreen
          title={`Episode ${episodeNumber} Player`}
        ></iframe>
      </div>
    );
  }
  
  // For movies or TV shows without specific episode information, keep using the tabs
  const [activeTab, setActiveTab] = useState("vidsrc");
  
  const videoSources = {
    vidsrc: `https://vidsrc.xyz/embed/${type}?tmdb=${tmdbId}&ds_lang=Spanish`,
    multiembed: `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
    embed2: `https://www.2embed.cc/embed/${tmdbId}`,
  };

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
      <DialogClose className="absolute right-2 top-2 z-50 p-1 rounded-full bg-black/70 hover:bg-black text-white">
        <X className="h-5 w-5" />
      </DialogClose>
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
