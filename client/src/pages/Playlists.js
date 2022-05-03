import { useState, useEffect } from 'react';
import axios from 'axios';
import { catchErrors } from '../utils';
import { getCurrentUserPlaylists } from '../spotify';
import { SectionWrapper, PlaylistsGrid, Loader } from '../components';

const Playlists = function () {
    const [playlistsData, setPlaylistsData] = useState(null);
    const [ playlists, setPlaylists ] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const userPlaylist = await getCurrentUserPlaylists();
            setPlaylistsData(userPlaylist['data']);
        };
        
        catchErrors(fetchData());
    }, []);

    useEffect(() => {
        if(!playlistsData) return;

        const fetchMoreData = async () => {
            if(playlistsData.next) {
                const { data } = await axios.get(playlistsData.next);
                setPlaylistsData(data);
            }
        };

        setPlaylists(playlists => ([
            ...playlists ? playlists : [],
            ...playlistsData.items
        ]));
        catchErrors(fetchMoreData());

    }, [playlistsData]);

    return (
        <> 
            { playlists ? (
                        <main>       
                        <SectionWrapper title="Playlists" breadcrumb={true}>
                            {playlists && playlists && (
                                <PlaylistsGrid playlists={playlists.slice(0, 10)} />
                            )}
                        </SectionWrapper>        
                    </main>
            ) : (
                <Loader />
            )}
        </>
    )
};

export default Playlists;