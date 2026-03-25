"use client";

import { useCallback } from "react";
import YouTube from "react-youtube";
import type { VideoPlayerProps } from "@/types";

function extractVideoId(url: string): string {
    // Handle youtube.com/watch?v=XXX, youtu.be/XXX, youtube.com/embed/XXX
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
        if (u.searchParams.has("v")) return u.searchParams.get("v")!;
        if (u.pathname.includes("/embed/")) return u.pathname.split("/embed/")[1];
    } catch {
        // If it's already just a video ID
    }
    return url;
}

export default function VideoPlayer({ videoUrl, lessonId, onComplete }: VideoPlayerProps) {
    const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const videoId = isYouTube ? extractVideoId(videoUrl) : null;

    const onEnd = useCallback(async () => {
        if (onComplete) onComplete();
    }, [onComplete]);

    return (
        <div className="relative w-full rounded-xl overflow-hidden shadow-2xl shadow-black/30 group">
            {/* Decorative gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/30 via-beginner/30 to-advanced/30 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />

            <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                {isYouTube && videoId ? (
                    <YouTube
                        videoId={videoId}
                        className="w-full h-full"
                        iframeClassName="w-full h-full absolute top-0 left-0"
                        opts={{
                            width: "100%",
                            height: "100%",
                            playerVars: {
                                autoplay: 0,
                                modestbranding: 1,
                                rel: 0,
                            },
                        }}
                        onEnd={onEnd}
                    />
                ) : (
                    <video
                        src={videoUrl}
                        controls
                        className="w-full h-full outline-none absolute top-0 left-0 object-contain"
                        onEnded={onEnd}
                        controlsList="nodownload"
                    />
                )}
            </div>
        </div>
    );
}
