import { useRef, useState } from "react";
import { Icons } from "../lib/icons";
import { VideoProps } from "../types";
import { useBrowser, Tooltip, Range, Switch } from "../../../";
import { AnimatePresence, motion } from "framer-motion";
import generateCSS from "../../../utils/generateCSS";

export const Video = (props: VideoProps) => {
    const browserName = useBrowser();
    const { src, primaryColor, subtitles, subtitleComponent, qualities, translations, controls, loop, features, muted = false, next, previous, defaultSettings, children, className, ...rest } = props;

    let videoRef = useRef<HTMLVideoElement>(null);
    let containerRef = useRef<HTMLDivElement>(null);
    let controlsRef = useRef<HTMLDivElement>(null);
    let canvasRef = useRef<HTMLCanvasElement>(null);

    let [playing, setPlaying] = useState(false);
    let [volume, setVolume] = useState(1);
    let [isMuted, setMuted] = useState(false);
    let [fullscreen, setFullscreen] = useState(false);
    let [ambientLight, setAmbientLight] = useState(false);
    let [__, setPictureInPicture] = useState(false);
    let [speed, setSpeed] = useState(1);
    let [quality, setQuality] = useState("auto");
    let [subtitle, setSubtitle] = useState(null as any);
    let [currentTime, setCurrentTime] = useState(0);
    let [duration, setDuration] = useState(0);
    let [_, setIsSeeking] = useState(false);
    let [controlsVisible, setControlsVisible] = useState(true);
    let [timeOut, setTimeOut] = useState(null as NodeJS.Timeout | null);
    let [settings, setSettings] = useState(null as any);
    let [isLooping, setIsLooping] = useState(false);


    const togglePlay = () => {
        if (videoRef.current) {
            setPlaying(state => !state);
            videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
        }
    }

    const handleVolume = (e: number) => {
        if (videoRef.current) {
            videoRef.current.volume = e;
            setVolume(e);
            if (videoRef.current.volume === 0) {
                videoRef.current.muted = true;
                setMuted(true);
            } else {
                videoRef.current.muted = false;
                setMuted(false);
            }
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(state => !state);
        }
    }

    const handleFullscreen = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
                setFullscreen(false);
            } else {
                containerRef.current.requestFullscreen();
                setFullscreen(true);
            }
        }
    }

    const handlePictureInPicture = () => {
        if (videoRef.current) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
                setPictureInPicture(false);
            } else {
                videoRef.current.requestPictureInPicture();
                setPictureInPicture(true);
            }
        }
    }

    const handleSpeed = (e: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = e;
            setSpeed(e);
        }
    }

    const handleQuality = (e: string | null) => {
        if (videoRef.current) {
            let quality = e;
            let video = videoRef.current as any;
            if (quality === null) {
                let ex = video.currentTime;
                let play = !video.paused;
                video.src = src;

                handleCurrentTime(ex);
                if (play) {
                    video.play();
                } else {
                    video.pause();
                }

                setQuality(null as any);
            } else if (qualities?.[quality]) {
                let ex = video.currentTime;
                let play = !video.paused;
                video.src = qualities?.[quality] || src;

                handleCurrentTime(ex);
                if (play) {
                    video.play();
                } else {
                    video.pause();
                }

                setQuality(quality);
            }
        }
    }

    const handleCurrentTime = (e: Number) => {
        if (videoRef.current) {
            let video = videoRef.current as any;
            video.currentTime = e;
            setCurrentTime(e as number);
        }
    }

    const handleSubtitle = (e: string | null) => {
        if (videoRef.current) {
            if (subtitles?.[e as string]) {
                setSubtitle(e);
            } else {
                setSubtitle(null);
            }
        }
    }

    const hideControls = () => {
        if (containerRef.current) {
            containerRef.current.style.overflow = "hidden !important";
            setControlsVisible(false);
        }
    }

    const showControls = () => {
        if (containerRef.current) {
            containerRef.current.style.overflow = "visible !important";
            setControlsVisible(true);
        }
    }

    const toggleLoop = () => {
        if (videoRef.current) {
            setIsLooping(state => !state);
            videoRef.current.loop = !videoRef.current.loop;
        }
    }


    const getLabel = (key: string) => {
        return translations?.[key] || key;
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - minutes * 60);
        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }

    const getCurrentSubtitle = () => {
        const my = subtitles ? subtitles[subtitle as string] : null;
        if (!my) return {
            text: ""
        };

        const currentSubtitle = my[Object.keys(my).find((key) => {
            const [start, end] = key.split(" --> ");
            const [startHours, startMinutes, startSeconds] = start.split(":");
            const [endHours, endMinutes, endSeconds] = end.split(":");
            const startTime = parseInt(startHours) * 3600 + parseInt(startMinutes) * 60 + parseFloat(startSeconds);
            const endTime = parseInt(endHours) * 3600 + parseInt(endMinutes) * 60 + parseFloat(endSeconds);
            if (currentTime >= startTime && currentTime <= endTime) return true;
            return false;
        }) as any];


        return {
            text: (currentSubtitle || "") as string,
        }
    }

    const generateCanvas = () => {
        if (videoRef.current) {
            const canvas = canvasRef.current as HTMLCanvasElement;
            if (canvas) {
                const video = videoRef.current as HTMLVideoElement;
                canvas.width = video.videoWidth / 2;
                canvas.height = video.videoHeight / 2;
                canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
        }
    }

    const Events = {
        onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            if (videoRef.current) {
                setDuration(videoRef.current.duration);
                setVolume(videoRef.current.volume);
                setMuted(videoRef.current.muted);
                setSpeed(videoRef.current.playbackRate);
                setIsLooping(videoRef.current.loop);
            }
        },
        onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
                generateCanvas();
            }
        },
        onPlay: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            if (videoRef.current) {
                setPlaying(true);
            }
        },
        onPause: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            if (videoRef.current) {
                setPlaying(false);
            }
        },
        onSeeking: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            if (videoRef.current) {
                setIsSeeking(true);
            }
        },
        onSeeked: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            if (videoRef.current) {
                setIsSeeking(false);
            }
        },
        onVolumeChange: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            if (videoRef.current) {
                setVolume(videoRef.current.volume);
                setMuted(videoRef.current.muted);
            }
        },
        onContextMenu: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            e.preventDefault();
        },
        onMouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (containerRef.current) {
                showControls();

                if (timeOut) clearTimeout(timeOut);
                setTimeOut(setTimeout(() => {
                    if (settings !== null) return;
                    if (!playing) return;
                    if (controlsVisible) {
                        hideControls();
                    }
                }, 2000));
            }
        },
        onMouseLeave: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (containerRef.current) {
                if (settings !== null) return;
                if (!playing) return;
                if (controlsVisible) {
                    hideControls();
                }
            }
        }
    };

    const settingsAnimation = {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        }
    }


    generateCSS(`.scrollbar[data-videoplayer="true"] {
        overflow-y: auto !important;
    }
    .scrollbar[data-videoplayer="true"]::-webkit-scrollbar {
        width: 0px;
    }

    button[data-videoplayer="true"] {
        --primary-color: ${primaryColor};
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        transition: background 0.2s ease-in-out;
        width: 2rem;
        height: 2rem;
        border-radius: 0.5rem;
        flex-shrink: 0;
        z-index: 999;
        pointer-events: all;
        position: relative;
    }
    button[data-videoplayer="true"]:hover {
        background: var(--primary-color);
    }

    .switch[data-videoplayer="true"] {
        --primary-color: ${primaryColor};
        width: 3rem;
        height: 1.5rem;
        border-radius: 100px;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding-right: 0.25rem;
        padding-left: 0.25rem;
    }

    .switch[data-videoplayer="true"][data-active="true"] {
        background-color: var(--primary-color);
        justify-content: flex-end;
    }

    .switch[data-videoplayer="true"][data-active="false"] {
        background-color: #52525b;
        justify-content: flex-start;
    }

    .switch[data-videoplayer="true"] div {
        width: 1rem;
        height: 1rem;
        background-color: #ffffff;
        border-radius: 50%;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.02);
    }

    video::-webkit-media-controls-panel {
        display: none !important;
        opacity: 1 !important;
    }`);

    return (
        <div
            className={`relative w-full h-full select-none !outline-none`}
            tabIndex={-1}
            ref={containerRef}
            onMouseMove={Events.onMouseMove}
            onMouseLeave={Events.onMouseLeave}
        >
            {ambientLight && !fullscreen && (
                <motion.canvas
                    ref={canvasRef}
                    className="absolute blur-[40px] z-[-1] w-full h-full pointer-events-none !opacity-50 outline-none"
                    layoutId="canvas"
                    tabIndex={-1}
                />
            )}
            <video
                src={src}
                ref={videoRef}
                playsInline
                controls={false}
                tabIndex={-1}
                onDoubleClick={e => {
                    e.preventDefault();
                    handleFullscreen();
                }}
                onClick={e => {
                    e.preventDefault();
                    togglePlay();
                }}
                onLoadedMetadata={Events.onLoadedMetadata}
                onTimeUpdate={Events.onTimeUpdate}
                onPlay={Events.onPlay}
                onPause={Events.onPause}
                onSeeking={Events.onSeeking}
                onSeeked={Events.onSeeked}
                onVolumeChange={Events.onVolumeChange}
                onContextMenu={Events.onContextMenu}
                className={`w-full h-full object-cover !outline-none ${typeof className === "string" ? className : className({ isFullscreen: fullscreen })}`}
                {...rest}
            />

            {children && children}
            <AnimatePresence initial={false}>
                {subtitle && (getCurrentSubtitle() || { text: "" })?.text.length > 0 && (
                    <motion.div
                        className={`video-subtitles absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center pointer-events-none`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                            duration: 0.2
                        }}
                    >
                        <div
                            className={`video-subtitles-text absolute flex flex-col w-full items-center ${controlsVisible ? "bottom-[5rem] lg:bottom-[8rem]" : "bottom-[1rem]"} pointer-events-none`}
                            style={{
                                transition: "bottom 0.3s ease-in-out"
                            }}
                        >
                            {subtitleComponent ? (
                                <motion.div>
                                    {subtitleComponent(getCurrentSubtitle()?.text)}
                                </motion.div>
                            ) : (
                                <motion.p
                                    className="text-white bg-black px-4 py-2 rounded text-sm lg:text-lg max-w-[60%]"
                                >
                                    {getCurrentSubtitle()?.text}
                                </motion.p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            <div
                className="absolute bottom-0 left-0 right-0 lg:bottom-5 lg:left-5 lg:right-5 bg-black/90 lg:rounded-lg p-2 lg:p-5 pt-2.5"
                style={{
                    opacity: controlsVisible ? 1 : 0,
                    transition: "opacity 0.2s ease-in-out",
                    pointerEvents: controlsVisible ? "all" : "none"
                }}
                ref={controlsRef}
            >
                <div className="flex items-center gap-4 mb-2">
                    <p className="text-white text-sm select-none">{formatTime(currentTime)}</p>
                    <Range
                        className="!w-full !mx-auto"
                        value={currentTime}
                        setValue={e => {
                            handleCurrentTime(e);
                        }}
                        min={0}
                        max={duration}
                        step={0.1}
                        colors={{
                            track: primaryColor,
                            thumb: primaryColor,
                            slider: primaryColor,
                            background: "rgba(255, 255, 255, 0.1)",
                        }}
                        sizes={{
                            height: "0.2rem",
                            thumb: {
                                default: "0.8rem",
                                hover: "0.4rem",
                                active: "0.6rem"
                            }
                        }}
                        tabIndex={-1}
                    />
                    <p className="text-white text-sm select-none">{formatTime(duration)}</p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">

                        {previous && !previous.disabled && (
                            <Tooltip content={getLabel("previous")} windowRef={controlsRef} position="top" autoPosition={false}>
                                <button data-videoplayer="true" onClick={previous.onClick}>
                                    <Icons.Previous />
                                </button>
                            </Tooltip>
                        )}
                        <Tooltip content={playing ? getLabel("pause") : getLabel("play")} windowRef={controlsRef} position="top" autoPosition={false}>
                            <button data-videoplayer="true" onClick={togglePlay}>
                                {playing ? <Icons.Pause /> : <Icons.Play />}
                            </button>
                        </Tooltip>
                        {next && !next.disabled && (
                            <Tooltip content={getLabel("next")} windowRef={controlsRef} position="top" autoPosition={false}>
                                <button data-videoplayer="true" onClick={next.onClick}>
                                    <Icons.Next />
                                </button>
                            </Tooltip>
                        )}

                        <div className="flex items-center gap-1 group">
                            <Tooltip content={isMuted ? getLabel("mute") : getLabel("unmute")} windowRef={controlsRef} position="top" autoPosition={false}>
                                <button data-videoplayer="true" onClick={toggleMute}>
                                    {isMuted ? <Icons.Mute /> : <Icons.Volume />}
                                </button>
                            </Tooltip>
                            <div className="flex items-center !w-[0] ml-0 group-hover:ml-2 group-hover:!w-20 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
                                <Range
                                    value={isMuted ? 0 : volume}
                                    setValue={e => {
                                        handleVolume(e as number);
                                    }}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    colors={{
                                        track: primaryColor,
                                        thumb: primaryColor,
                                        slider: primaryColor,
                                        background: "rgba(255, 255, 255, 0.1)",
                                    }}
                                    sizes={{
                                        height: "0.2rem",
                                        thumb: {
                                            default: "0.8rem",
                                            hover: "0.4rem",
                                            active: "0.6rem"
                                        }
                                    }}
                                    className="!w-full"
                                    withHover={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Tooltip content={getLabel("settings")} windowRef={controlsRef} position="top" autoPosition={false} disabled={settings !== null}>
                            <button data-videoplayer="true" onClick={() => {
                                if (settings !== null) setSettings(null);
                                else setSettings("general");
                            }}>
                                <Icons.Settings />
                            </button>
                        </Tooltip>
                        {browserName === "Chrome" && (
                            <Tooltip content={getLabel("pip")} windowRef={controlsRef} position="top" autoPosition={false} disabled={settings !== null}>
                                <button data-videoplayer="true" onClick={handlePictureInPicture}>
                                    <Icons.PictureInPicture />
                                </button>
                            </Tooltip>
                        )}
                        <Tooltip content={fullscreen ? getLabel("exitFullScreen") : getLabel("enterFullScreen")} windowRef={controlsRef} position="top" autoPosition={false} disabled={settings !== null}>
                            <button data-videoplayer="true" onClick={handleFullscreen}>
                                {fullscreen ? <Icons.ExitFullScreen /> : <Icons.FullScreen />}
                            </button>
                        </Tooltip>

                    </div>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {settings !== null && settings !== "none" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                        }}
                        className="video-settings absolute bottom-[5rem] lg:bottom-[8rem] right-5 w-[18rem]"
                    >
                        <AnimatePresence initial={false}>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut"
                                }}
                                layout
                                className={`bg-black/90 rounded-lg overflow-hidden text-sm py-2 max-h-[8rem] sm:max-h-[10re] lg:max-h-[18rem] ${settings === "general" ? "overflow-y-auto lg:overflow-y-hidden" : "overflow-y-auto"}`}
                            >
                                <motion.div
                                    className="flex items-center justify-between w-full"
                                >
                                    {settings === "general" && (
                                        <motion.div
                                            className="flex flex-col w-full"
                                            {...settingsAnimation}
                                        >
                                            {features?.ambientLight === true && (
                                                <div className="flex items-center justify-between w-full px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200" onClick={() => setAmbientLight(!ambientLight)}>
                                                    <p className="text-white">{getLabel("ambiance")}</p>
                                                    <Switch
                                                        value={ambientLight}
                                                        data-videoplayer="true"
                                                    />
                                                </div>
                                            )}
                                            {features?.loop === true && (
                                                <div className="flex items-center justify-between w-full px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200" onClick={() => toggleLoop()}>
                                                    <p className="text-white">{getLabel("loop")}</p>
                                                    <Switch
                                                        value={isLooping}
                                                        data-videoplayer="true"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between w-full px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200" onClick={() => setSettings("playbackSpeed")}>
                                                <p className="text-white">{getLabel("playbackSpeed")}</p>
                                                <div className="flex items-center gap-1">
                                                    <p className="text-gray-400">{speed === 1 ? "Normal" : speed + "x"}</p>
                                                    <Icons.RightArrow className="text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                            {Object.keys(subtitles || {}).length > 0 && (
                                                <div className="flex items-center justify-between w-full px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200" onClick={() => setSettings("subtitles")}>
                                                    <p className="text-white">{getLabel("captions")}</p>
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-gray-400">{subtitle === null ? getLabel("off") : subtitle}</p>
                                                        <Icons.RightArrow className="text-gray-400 w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}
                                            {Object.keys(qualities || {}).length > 0 && (
                                                <div className="flex items-center justify-between w-full px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200" onClick={() => setSettings("quality")}>
                                                    <p className="text-white">{getLabel("quality")}</p>
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-gray-400">{getLabel(quality || "auto")}</p>
                                                        <Icons.RightArrow className="text-gray-400 w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                    {settings === "playbackSpeed" && (
                                        <motion.div
                                            className="flex flex-col w-full"
                                            {...settingsAnimation}
                                        >
                                            <p onClick={() => setSettings("general")} className="text-gray-200 flex items-center gap-1 px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200">
                                                <Icons.LeftArrow className="w-4 h-4" />
                                                <p>{getLabel("playbackSpeed")}</p>
                                            </p>
                                            <div className="w-full h-0.5 bg-zinc-500/10 my-1" />
                                            <div className="flex flex-col w-full">
                                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speedValue, index) => (
                                                    <div key={index} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200" onClick={() => handleSpeed(speedValue)}>
                                                        <div className="w-4 h-4">
                                                            {speed === speedValue && (
                                                                <Icons.Check className="w-full h-full text-white" />
                                                            )}
                                                        </div>
                                                        <p className="text-white">{speedValue === 1 ? "Normal" : speedValue + "x"}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                    {settings === "subtitles" && (
                                        <motion.div
                                            className="flex flex-col w-full"
                                            {...settingsAnimation}
                                        >
                                            <p onClick={() => setSettings("general")} className="text-gray-200 flex items-center gap-1 px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200">
                                                <Icons.LeftArrow className="w-4 h-4" />
                                                <p>{getLabel("captions")}</p>
                                            </p>
                                            <div className="w-full h-0.5 bg-zinc-500/10 my-1" />
                                            <div className="flex flex-col w-full">
                                                <div className="flex items-center gap-2 w-full px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200" onClick={() => handleSubtitle(null)}>
                                                    <div className="w-4 h-4">
                                                        {subtitle === null && (
                                                            <Icons.Check className="w-full h-full text-white" />
                                                        )}
                                                    </div>
                                                    <p className="text-white">{getLabel("off")}</p>
                                                </div>
                                                {Object.keys(subtitles || {}).map((subtitleValue, index) => (
                                                    <div key={index} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200" onClick={() => handleSubtitle(subtitleValue)}>
                                                        <div className="w-4 h-4">
                                                            {subtitle === subtitleValue && (
                                                                <Icons.Check className="w-full h-full text-white" />
                                                            )}
                                                        </div>
                                                        <p className="text-white">{subtitleValue}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                    {settings === "quality" && (
                                        <motion.div
                                            className="flex flex-col w-full"
                                            {...settingsAnimation}
                                        >
                                            <p onClick={() => setSettings("general")} className="text-gray-200 flex items-center gap-1 px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200">
                                                <Icons.LeftArrow className="w-4 h-4" />
                                                <p>{getLabel("quality")}</p>
                                            </p>
                                            <div className="w-full h-0.5 bg-zinc-500/10 my-1" />
                                            <div className="flex flex-col w-full">
                                                {Object.keys(qualities || {}).map((qualityValue, index) => (
                                                    <div key={index} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200" onClick={() => handleQuality(qualityValue)}>
                                                        <div className="w-4 h-4">
                                                            {quality === qualityValue && (
                                                                <Icons.Check className="w-full h-full text-white" />
                                                            )}
                                                        </div>
                                                        <p className="text-white">{qualityValue}</p>
                                                    </div>
                                                ))}

                                                <div className="flex items-center gap-2 w-full px-4 py-3 hover:bg-zinc-500/5 select-none cursor-pointer transition-all duration-200" onClick={() => handleQuality(null)}>
                                                    <div className="w-4 h-4">
                                                        {quality === null && (
                                                            <Icons.Check className="w-full h-full text-white" />
                                                        )}
                                                    </div>
                                                    <p className="text-white">{getLabel("auto")}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}