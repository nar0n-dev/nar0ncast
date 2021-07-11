import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    playList: (list: Episode[], index: number) => void;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
    previousEpisode: () => void;
    nextEpisode: () => void;
    clearPlayer: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)
  
    const play = (episode: Episode) => {
      setEpisodeList([episode])
      setCurrentEpisodeIndex(0);
      setIsPlaying(true)
    }

    const playList = (list: Episode[], index: number) => {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true)
    }
  
    const togglePlay = () => {
      setIsPlaying(!isPlaying)
    }

    const toggleLoop = () => {
        setIsLooping(!isLooping)
    }
    
    const toggleShuffle = () => {
        setIsShuffling(!isShuffling)
    }
  
    const setPlayingState = (state: boolean) => {
      setIsPlaying(state)
    }

    const clearPlayer = () => {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0)
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;


    const nextEpisode = () => {

        if(isShuffling){
            const nextRandomEpIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpIndex);
        }else if(hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        } 
    }

    const previousEpisode = () => {
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        } 
    }

    return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState, playList, nextEpisode, previousEpisode, hasNext, hasPrevious, isLooping, toggleLoop, toggleShuffle, isShuffling, clearPlayer}}>
        { children }
    </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}